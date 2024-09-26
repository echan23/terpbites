from playwright.sync_api import sync_playwright
from datetime import datetime
from config import *  # Assuming BASE_URL_SOUTH, BASE_URL_NORTH, and BASE_URL_Y are imported
import re

# Base URLs and corresponding location names
BASE_URLS = {
    "South": BASE_URL_SOUTH,
    "North": BASE_URL_NORTH,
    "Y": BASE_URL_Y
}

# Nutrient labels mapping
NUTRIENT_LABELS = {
    'calories': ['Calories per serving', 'Calories'],
    'serving_size': ['Serving Size', 'Serving size'],
    'protein': ['Protein'],
    'total_fat': ['Total Fat', 'Fat'],
    'carbs': ['Total Carbohydrate', 'Carbohydrates', 'Carbs'],
    'sodium': ['Sodium'],
    'sugar': ['Total Sugars', 'Sugars', 'Sugar']
}

# Function to run scraping using Playwright
def run_scraping(cursor, connection):
    today = datetime.today()
    formatted_date = today.strftime("%-m/%d/%Y")
    
    def insert_food_data(cursor, connection, item_data):
        try:
            query = '''
                INSERT INTO food_items (name, calories, protein, total_fat, carbs, sodium, sugar, serving_size, location)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    calories = VALUES(calories),
                    protein = VALUES(protein),
                    total_fat = VALUES(total_fat),
                    carbs = VALUES(carbs),
                    sodium = VALUES(sodium),
                    sugar = VALUES(sugar),
                    serving_size = VALUES(serving_size),
                    location = VALUES(location)
            '''
            cursor.execute(query, (
                item_data['name'],
                item_data.get('calories', 'Not Found'),
                item_data.get('protein', 'Not Found'),
                item_data.get('total_fat', 'Not Found'),
                item_data.get('carbs', 'Not Found'),
                item_data.get('sodium', 'Not Found'),
                item_data.get('sugar', 'Not Found'),
                item_data.get('serving_size', 'Not Found'),
                item_data.get('location', 'Not Found')
            ))
            connection.commit()
            print(f"Data for {item_data['name']} inserted successfully.")
        except Exception as e:
            print(f"Error inserting data: {e}")

    # Function to extract nutrient values using multiple strategies
    def extract_nutrient_value(page, labels, is_serving_size=False):
        try:
            if is_serving_size:
                # 1. Find the element containing the word 'Serving'
                serving_label_element = page.query_selector('xpath=//*[contains(text(), "Serving size")]')

                # 2. Find the second occurrence of the 'nutfactservsize' class
                serving_size_elements = page.query_selector_all('.nutfactsservsize')

                # 3. If we found both, get the second 'nutfactservsize' or the element right after 'Serving'
                if len(serving_size_elements) > 1:
                    # Return the second serving size found
                    return serving_size_elements[1].inner_text().strip()
                elif serving_label_element:
                    # If there's no second 'nutfactservsize', get the next element after 'Serving'
                    sibling_text = serving_label_element.evaluate('node => node.nextSibling ? node.nextSibling.textContent.trim() : null')
                    if sibling_text:
                        return sibling_text.strip()
                return 'Not Found'

            # Non-serving size extraction logic (standard extraction)
            for label in labels:
                element = page.query_selector(f'xpath=//*[contains(translate(text(), "{label.upper()}", "{label.lower()}"), "{label.lower()}")]')
                if element:
                    sibling_text = element.evaluate('node => node.nextSibling ? node.nextSibling.textContent.trim() : null')
                    if sibling_text:
                        return sibling_text
                    # Get value from the same element
                    element_text = element.inner_text().strip()
                    value = element_text.replace(label, '', 1).strip(':').strip()
                    if value:
                        return value
                    # Get value from parent element if necessary
                    parent_text = element.evaluate('node => node.parentElement ? node.parentElement.textContent : null')
                    if parent_text:
                        match = re.search(rf'{label}[\s\:]*([\d\.]+\s*\w*)', parent_text, re.IGNORECASE)
                        if match:
                            return match.group(1).strip()
            return 'Not Found'
        except Exception as e:
            print(f"Error extracting nutrient: {e}")
            return 'Not Found'

    # Run Playwright to scrape data and insert into MySQL
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=HEADLESS)
        page = browser.new_page()

        # Loop over base URLs for each dining hall location
        for location, base_url in BASE_URLS.items():
            dynamic_url = f"{base_url}{formatted_date}"
            print(f"Scraping for location: {location}, URL: {dynamic_url}")

            page.goto(dynamic_url)
            page.wait_for_selector('a.menu-item-name')

            # Collect item names and hrefs before navigation
            menu_items = page.query_selector_all('a.menu-item-name')
            base_item_url = "https://nutrition.umd.edu/"
            items_data = []
            for item in menu_items:
                item_name = item.inner_text()
                href = item.get_attribute('href')
                item_url = f"{base_item_url}{href}"
                items_data.append({'name': item_name, 'url': item_url, 'location': location})

            # Process each item
            for item_data in items_data:
                item_name = item_data['name']
                item_url = item_data['url']
                location = item_data['location']  # Add location to item data
                try:
                    print(f"Launching page for item: {item_name}, Link: {item_url}")

                    page.goto(item_url)
                    page.wait_for_load_state('networkidle')

                    for nutrient_key, labels in NUTRIENT_LABELS.items():
                        # Handle special case for "serving_size"
                        if nutrient_key == 'serving_size':
                            value = extract_nutrient_value(page, labels, is_serving_size=True)
                        else:
                            value = extract_nutrient_value(page, labels)
                        
                        item_data[nutrient_key] = value
                        print(f"{nutrient_key}: {value}")

                    # Insert into the database
                    insert_food_data(cursor, connection, item_data)

                except Exception as e:
                    print(f"Error processing item {item_name}: {e}")

        browser.close()

# Function to query food data by name and optionally by location
def query_food_data(cursor, food_name, location=None):
    try:
        if location:  # If location is specified
            query = "SELECT * FROM food_items WHERE name LIKE %s AND location = %s"
            cursor.execute(query, ('%' + food_name + '%', location))
        else:  # If no location is specified, search only by name
            query = "SELECT * FROM food_items WHERE name LIKE %s"
            cursor.execute(query, ('%' + food_name + '%',))

        result = cursor.fetchall()
        if result:
            for row in result:
                print(f"Name: {row[1]}, Calories: {row[2]}, Protein: {row[3]}, Total Fat: {row[4]}, Carbs: {row[5]}, Sodium: {row[6]}, Sugar: {row[7]}, Serving Size: {row[8]}, Location: {row[9]}")
        else:
            print(f"No data found for food item: {food_name} at {location if location else 'any location'}")
    except Exception as e:
        print(f"Error retrieving data: {e}")

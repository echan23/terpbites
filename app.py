from playwright.sync_api import sync_playwright
from datetime import datetime
from config import *  # Assuming BASE_URL_SOUTH, BASE_URL_NORTH, and BASE_URL_Y are imported

# Base URLs and corresponding location names
BASE_URLS = {
    "Y": BASE_URL_Y,
    "South": BASE_URL_SOUTH,
    "North": BASE_URL_NORTH
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

                    # Calories
                    calories_element = page.query_selector('p:has-text("Calories per serving") + p')
                    item_data['calories'] = calories_element.inner_text() if calories_element else 'Not Found'

                    # Serving Size
                    serving_size_element = page.query_selector('div:has-text("Serving size")')
                    if serving_size_element:
                        page.wait_for_selector('.nutfactsservsize')
                        serving_size_element = page.locator('.nutfactsservsize').nth(1)  # Get the second element
                        item_data['serving_size'] = serving_size_element.inner_text().strip()
                    else:
                        item_data['serving_size'] = 'Not Found'

                    # Protein
                    protein_element = page.query_selector('b:has-text("Protein")')
                    if protein_element:
                        protein_value_handle = protein_element.evaluate_handle('node => node.nextSibling')
                        item_data['protein'] = protein_value_handle.evaluate('node => node.textContent.trim()')
                        protein_value_handle.dispose()
                    else:
                        item_data['protein'] = 'Not Found'

                    # Total Fat
                    total_fat_element = page.query_selector('b:has-text("Total Fat")')
                    if total_fat_element:
                        total_fat_handle = total_fat_element.evaluate_handle('node => node.nextSibling')
                        item_data['total_fat'] = total_fat_handle.evaluate('node => node.textContent.trim()')
                        total_fat_handle.dispose()
                    else:
                        item_data['total_fat'] = 'Not Found'

                    # Carbs
                    carbs_element = page.query_selector('b:has-text("Total Carbohydrate")')
                    if carbs_element:
                        carbs_element_handle = carbs_element.evaluate_handle('node => node.nextSibling')
                        item_data['carbs'] = carbs_element_handle.evaluate('node => node.textContent.trim()')
                        carbs_element_handle.dispose()
                    else:
                        item_data['carbs'] = 'Not Found'

                    # Sodium
                    sodium_element = page.query_selector('b:has-text("Sodium")')
                    if sodium_element:
                        sodium_element_handle = sodium_element.evaluate_handle('node => node.nextSibling')
                        item_data['sodium'] = sodium_element_handle.evaluate('node => node.textContent.trim()')
                        sodium_element_handle.dispose()
                    else:
                        item_data['sodium'] = 'Not Found'

                    # Sugar
                    sugar_element = page.locator('span.nutfactstopnutrient:has-text("Total Sugars")')
                    item_data['sugar'] = sugar_element.inner_text().split()[-1] if sugar_element else 'Not Found'

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
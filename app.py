from playwright.sync_api import sync_playwright
from datetime import datetime
from config import *  # Assuming BASE_URL_SOUTH, BASE_URL_NORTH, and BASE_URL_Y are imported
import re
import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
from db_connection import connect_to_mysql

app = Flask(__name__)
CORS(app)

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

# Insert bulk food data
def insert_bulk_food_data(cursor, connection, items_data):
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
        data_to_insert = [
            (
                item['name'],
                item.get('calories', 'Not Found'),
                item.get('protein', 'Not Found'),
                item.get('total_fat', 'Not Found'),
                item.get('carbs', 'Not Found'),
                item.get('sodium', 'Not Found'),
                item.get('sugar', 'Not Found'),
                item.get('serving_size', 'Not Found'),
                item.get('location', 'Not Found')
            )
            for item in items_data
        ]
        cursor.executemany(query, data_to_insert)
        connection.commit()
        print(f"Inserted {len(items_data)} items successfully.")
    except Exception as e:
        print(f"Error inserting bulk data: {e}")

# Function to run scraping using Playwright
def run_scraping(cursor, connection):
    today = datetime.today()
    formatted_date = today.strftime("%-m/%d/%Y")
    print("Beginning scraping for formatted_date")

    # Function to extract nutrient values using multiple strategies
    def extract_nutrient_value(page, labels, is_serving_size=False):
        try:
            if is_serving_size:
                serving_label_element = page.query_selector('xpath=//*[contains(text(), "Serving size")]')
                serving_size_elements = page.query_selector_all('.nutfactsservsize')

                if len(serving_size_elements) > 1:
                    return serving_size_elements[1].inner_text().strip()
                elif serving_label_element:
                    sibling_text = serving_label_element.evaluate('node => node.nextSibling ? node.nextSibling.textContent.trim() : null')
                    if sibling_text:
                        return sibling_text.strip()
                return 'Not Found'

            for label in labels:
                element = page.query_selector(f'xpath=//*[contains(translate(text(), "{label.upper()}", "{label.lower()}"), "{label.lower()}")]')
                if element:
                    sibling_text = element.evaluate('node => node.nextSibling ? node.nextSibling.textContent.trim() : null')
                    if sibling_text:
                        return sibling_text
                    element_text = element.inner_text().strip()
                    value = element_text.replace(label, '', 1).strip(':').strip()
                    if value:
                        return value
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
                        if nutrient_key == 'serving_size':
                            value = extract_nutrient_value(page, labels, is_serving_size=True)
                        else:
                            value = extract_nutrient_value(page, labels)

                        item_data[nutrient_key] = value
                        print(f"{nutrient_key}: {value}")

                    #Add delay to avoid overloading the server
                    #time.sleep(random.uniform(1.5, 3.5))

                except Exception as e:
                    print(f"Error processing item {item_name}: {e}")

            # Perform bulk insert after processing all items for the location
            insert_bulk_food_data(cursor, connection, items_data)

        browser.close()

# Function to query food data by name and optionally by location
def query_food_data(cursor, food_name, location=None, limit=10):
    try:
        # Prepare the SQL query based on whether location is provided
        if location:
            query = """
                SELECT * FROM food_items 
                WHERE LOWER(name) LIKE LOWER(%s) AND location = %s
                LIMIT %s
            """
            cursor.execute(query, ('%' + food_name + '%', location, limit))
        else:
            query = """
                SELECT * FROM food_items 
                WHERE LOWER(name) LIKE LOWER(%s)
                LIMIT %s
            """
            cursor.execute(query, ('%' + food_name + '%', limit))

        # Fetch results
        result = cursor.fetchall()
        if result:
            data = []
            for row in result:
                food_data = {
                    'name': row[1],
                    'calories': row[2],
                    'protein': row[3],
                    'total_fat': row[4],
                    'carbs': row[5],
                    'sodium': row[6],
                    'sugar': row[7],
                    'serving_size': row[8],
                    'location': row[9]
                }
                data.append(food_data)

            '''
            for item in data:
                print(f"Name: {item['name']}, Calories: {item['calories']}, Protein: {item['protein']}, "
                      f"Total Fat: {item['total_fat']}, Carbs: {item['carbs']}, Sodium: {item['sodium']}, "
                      f"Sugar: {item['sugar']}, Serving Size: {item['serving_size']}, Location: {item['location']}")
            '''
            
            return data
        else:
            print(f"No data found for food item: {food_name} at {location if location else 'any location'}")
            return None

    except Exception as e:
        print(f"Error retrieving data: {e}")
        return None

#Clears table before rescraping occurs
def clear_table(cursor, connection):
    try:
        # Truncate the table to remove all rows
        query = "TRUNCATE TABLE food_items;"
        cursor.execute(query)
        connection.commit()
        print("Table cleared successfully.")
    except Exception as e:
        print(f"Error clearing table: {e}")

'''
@app.route('/api/food', methods=['GET'])
def get_food_data():
    try:
        food_name = request.args.get('food_name', '').strip()
        location = request.args.get('location', '').strip()
        limit = request.args.get('limit', 10, type=int)

        if not food_name:
            return jsonify({"error": "food_name parameter is required"}), 400

        # Use the context manager to automatically handle the connection closing
        with connect_to_mysql() as connection:
            if connection:
                cursor = connection.cursor()

                # Query for food data
                results = query_food_data(cursor, food_name, location if location else None, limit)
                if results:
                    return jsonify(results), 200
                else:
                    return jsonify({"message": "No data found"}), 404
    except Exception as e:
        print(f"Error retrieving food data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
'''
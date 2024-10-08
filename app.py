from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import requests
from datetime import datetime
from config import *
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

def run_scraping(cursor, connection):
    today = datetime.today()
    formatted_date = today.strftime("%-m/%d/%Y")
    print(f"Beginning scraping for {formatted_date}")
     
    # Function to extract nutrient values. The labels are possible names for the item.
    def extract_nutrient_value(soup, labels, is_serving_size=False):
        try:
            for label in labels:
                label_regex = re.compile(re.escape(label), re.IGNORECASE)
                
                # Find the element containing the label
                nutrient_element = soup.find(string=label_regex)
                
                if nutrient_element:
                    # Special cases for calories and serving size because they are formatted differently from other macros
                    if "calories" in label.lower():
                        next_p_element = nutrient_element.find_next('p')
                        if next_p_element:
                            value = next_p_element.get_text(strip=True)
                            if re.match(r'^[\d\.]+\s*\w*$', value):
                                return value
                    if is_serving_size:
                        # The value is in the next sibling or in the next element with a specific class due to layout of site (may change)
                        serving_size_element = nutrient_element.find_next_sibling(string=True)
                        if serving_size_element and re.match(r'^[\d\.]+\s*\w*$', serving_size_element.strip()):
                            return serving_size_element.strip()
                        
                        # Try to find within the parent element or a known class
                        serving_size_parent = nutrient_element.parent
                        if serving_size_parent:
                            possible_value = serving_size_parent.find_next(class_="nutfactsservsize")
                            if possible_value:
                                return possible_value.get_text(strip=True)
                        return NOT_FOUND

                    # Handle other nutrient values. Find the next sibling after the label and clean the text to get the value. 
                    # If not a match, then do the same for the parent element.
                    next_sibling = nutrient_element.find_next(string=True)
                    
                    if next_sibling:
                        value = next_sibling.strip()  # Ignore the label because we only want the numerical value
                        if re.match(r'^[\d\.]+\s*\w*$', value):  # Check if the extracted value is a valid number or unit
                            return value

                    parent_element = nutrient_element.parent
                    if parent_element:
                        parent_text = parent_element.get_text(strip=True)
                        match = re.search(rf'{label}[\s\:]*([\d\.]+\s*\w*)', parent_text, re.IGNORECASE)
                        if match:
                            return match.group(1).strip()

            return NOT_FOUND
        
        except Exception as e:
            print(f"Error extracting nutrient: {e}")
            return NOT_FOUND

    
    # Run BeautifulSoup to scrape data by looping over base URLs for each dining hall location.
    for location, base_url in BASE_URLS.items():
        dynamic_url = f"{base_url}{formatted_date}"
        print(f"Scraping for location: {location}, URL: {dynamic_url}")

        response = requests.get(dynamic_url)
        if response.status_code != 200:
            print(f"Failed to retrieve page for {location}. Status code: {response.status_code}")
            continue

        soup = BeautifulSoup(response.content, 'html.parser')
        menu_items = soup.select('a.menu-item-name')
        base_item_url = BASE_ITEM_URL
        items_data = [] # Temporary list for each location's data

        for item in menu_items:
            item_name = item.get_text()
            href = item['href']
            item_url = f"{base_item_url}{href}"
            items_data.append({'name': item_name, 'url': item_url, 'location': location})

        print(len(menu_items))

        for item_data in items_data:
            item_name = item_data['name']
            item_url = item_data['url']
            location = item_data['location']
            try:
                print(f"Scraping details for item: {item_name}, Link: {item_url}")

                item_response = requests.get(item_url)
                if item_response.status_code != 200:
                    print(f"Failed to retrieve item page for {item_name}. Status code: {item_response.status_code}")
                    continue

                item_soup = BeautifulSoup(item_response.content, 'html.parser')

                # Extract nutrients for each label
                for nutrient_key, labels in NUTRIENT_LABELS.items():
                    if nutrient_key == 'serving_size':
                        value = extract_nutrient_value(item_soup, labels, is_serving_size=True)
                    else:
                        value = extract_nutrient_value(item_soup, labels)

                    item_data[nutrient_key] = value if value else 'Not Found'

                # Simulate waiting time, can adjust if needed
                time.sleep(random.uniform(0, 0))

            except Exception as e:
                print(f"Error processing item {item_name}: {e}")

        #Insert items for location 
        try:
            insert_bulk_food_data(cursor, connection, items_data)
            print(f"Completed scraping and insertion for {location}")
        except Exception as e:
            print(f"Error inserting data for {location}: {e}")

    print("All locations scraped and data inserted")


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


@app.route('/api/food', methods=['GET'])
def get_food_data():
    print("Received request for /api/food")
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


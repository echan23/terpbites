import os
import re
import json
import time
import random
import requests
from datetime import datetime
from bs4 import BeautifulSoup
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

# Nutrient parsing labels
NUTRIENT_LABELS = {
    'calories': ['Calories per serving', 'Calories'],
    'serving_size': ['Serving Size', 'Serving size'],
    'protein': ['Protein'],
    'total_fat': ['Total Fat', 'Fat'],
    'carbs': ['Total Carbohydrate', 'Carbohydrates', 'Carbs'],
    'sodium': ['Sodium'],
    'sugar': ['Total Sugars', 'Sugars', 'Sugar']
}

BASE_URLS = {
    "South": os.environ["BASE_URL_SOUTH"],
    "North": os.environ["BASE_URL_NORTH"],
    "Y": os.environ["BASE_URL_Y"]
}
BASE_ITEM_URL = os.environ["BASE_ITEM_URL"]
NOT_FOUND = None

def extract_nutrient_value(soup, labels, is_serving_size=False):
    for label in labels:
        label_regex = re.compile(re.escape(label), re.IGNORECASE)
        nutrient_element = soup.find(string=label_regex)
        if not nutrient_element:
            continue

        if "calories" in label.lower():
            next_p = nutrient_element.find_next("p")
            if next_p:
                return next_p.get_text(strip=True)

        if is_serving_size:
            next_sibling = nutrient_element.find_next_sibling(string=True)
            if next_sibling:
                return next_sibling.strip()
            parent = nutrient_element.parent
            if parent:
                maybe = parent.find_next(class_="nutfactsservsize")
                if maybe:
                    return maybe.get_text(strip=True)
            return NOT_FOUND

        next_sibling = nutrient_element.find_next(string=True)
        if next_sibling and re.match(r'^[\d\.]+\s*\w*$', next_sibling.strip()):
            return next_sibling.strip()

        parent = nutrient_element.parent
        if parent:
            match = re.search(rf'{label}[\s\:]*([\d\.]+\s*\w*)', parent.get_text(strip=True), re.IGNORECASE)
            if match:
                return match.group(1).strip()

    return NOT_FOUND

def insert_data(connection, items_data):
    cursor = connection.cursor()
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
    data = [(item['name'], item['calories'], item['protein'], item['total_fat'], item['carbs'],
             item['sodium'], item['sugar'], item['serving_size'], item['location']) for item in items_data]
    cursor.executemany(query, data)
    connection.commit()
    cursor.close()

def lambda_handler(event, context):
    conn = mysql.connector.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASS"],
        database=os.environ["DB_NAME"],
    )
    print("DB_USER:", os.environ.get("DB_USER"))

    today = datetime.today().strftime("%-m/%d/%Y")

    for location, base_url in BASE_URLS.items():
        dynamic_url = f"{base_url}{today}"
        response = requests.get(dynamic_url)
        if response.status_code != 200:
            continue

        soup = BeautifulSoup(response.content, 'html.parser')
        items = soup.select('a.menu-item-name')

        items_data = []
        for item in items:
            name = item.get_text()
            url = f"{BASE_ITEM_URL}{item['href']}"
            item_resp = requests.get(url)
            if item_resp.status_code != 200:
                continue
            item_soup = BeautifulSoup(item_resp.content, 'html.parser')
            item_data = {"name": name, "url": url, "location": location}
            for nutrient, labels in NUTRIENT_LABELS.items():
                val = extract_nutrient_value(item_soup, labels, nutrient == 'serving_size')
                item_data[nutrient] = val or NOT_FOUND
            items_data.append(item_data)
            time.sleep(random.uniform(0, 0.2))  # avoid hammering the server

        insert_data(conn, items_data)

    conn.close()
    return {"statusCode": 200, "body": json.dumps("Scraping completed")}

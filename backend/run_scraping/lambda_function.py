import os
import re
import json
import requests
import mysql.connector
from datetime import datetime
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor, as_completed

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


def truncate_table(connection):
    cursor = connection.cursor()
    cursor.execute("TRUNCATE TABLE food_items;")
    connection.commit()
    cursor.close()


#Fetch an item page and extract its data
def fetch_item(session, item, location):
    name = item.get_text()
    url = f"{BASE_ITEM_URL}{item['href']}"
    try:
        resp = session.get(url, timeout=10)
        if resp.status_code != 200:
            return None
        item_soup = BeautifulSoup(resp.content, 'html.parser')
        item_data = {"name": name, "url": url, "location": location}
        for nutrient, labels in NUTRIENT_LABELS.items():
            val = extract_nutrient_value(item_soup, labels, nutrient == 'serving_size')
            item_data[nutrient] = val or NOT_FOUND
        return item_data
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None


def lambda_handler(event, context):
    conn = mysql.connector.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASS"],
        database=os.environ["DB_NAME"],
    )

    truncate_table(conn)

    today = datetime.today().strftime("%-m/%d/%Y")
    print("beginning scraping")
    session = requests.Session()
    for location, base_url in BASE_URLS.items():
        dynamic_url = f"{base_url}{today}"
        response = session.get(dynamic_url, timeout=10)
        if response.status_code != 200:
            continue

        soup = BeautifulSoup(response.content, 'html.parser')
        items = soup.select('a.menu-item-name')

        items_data = []
        with ThreadPoolExecutor(max_workers=8) as executor:
            futures = [executor.submit(fetch_item, session, item, location) for item in items]
            for future in as_completed(futures):
                result = future.result()
                if result:
                    #print(result)
                    items_data.append(result)

        insert_data(conn, items_data)

    conn.close()
    return {"statusCode": 200, "body": json.dumps("Scraping completed")}

"""
if __name__ == "__main__":
    lambda_handler(None, None)
"""
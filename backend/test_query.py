from backend.db_connection import connect_to_mysql
from backend.app import query_food_data

def test_query():
    connection = connect_to_mysql()
    if connection:
        cursor = connection.cursor()

        food_name = "apple"
        location = "South"

        results = query_food_data(cursor, food_name, location, limit=10)
        if results:
            for item in results:
                print(f"Name: {item['name']}, Calories: {item['calories']}, Protein: {item['protein']}")
        else:
            print("No data found.")

        cursor.close()
        connection.close()

if __name__ == "__main__":
    test_query()

from db_connection import connect_to_mysql
from app import query_food_data

def test_query():
    # Connect to the AWS RDS instance
    connection = connect_to_mysql()
    if connection:
        cursor = connection.cursor()

        # Test the query_food_data function with sample inputs
        food_name = "pizza"
        location = "North"

        results = query_food_data(cursor, food_name, location, limit=10)
        if results:
            for item in results:
                print(f"Name: {item['name']}, Calories: {item['calories']}, Protein: {item['protein']}")
        else:
            print("No data found.")

        # Close the connection
        cursor.close()
        connection.close()

if __name__ == "__main__":
    test_query()

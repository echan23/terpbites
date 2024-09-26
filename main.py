from db_connection import connect_to_mysql
from app import run_scraping, query_food_data, clear_table

if __name__ == "__main__":
    try:
        # Use the context manager to automatically handle the connection closing
        with connect_to_mysql() as connection:
            if connection:
                cursor = connection.cursor()

                clear_table(cursor, connection)
                run_scraping(cursor, connection)
                
                # Query for food and location
                food_name = input("Enter the name of the food to search: ").strip()
                location = input("Enter the location (or press Enter for all locations): ").strip()
                
                if food_name:
                    query_food_data(cursor, food_name, location if location else None)
                else:
                    print("No food name entered.")
    
    except Exception as e:
        print(f"An error occurred: {e}")

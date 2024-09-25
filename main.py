from app import run_scraping, query_food_data
from db_connection import connect_to_mysql, close_connection

if __name__ == "__main__":

    connection, cursor = connect_to_mysql()
    
    if connection and cursor:

        run_scraping(cursor, connection)
        
        food_name = input("Enter the name of the food to search: ")
        query_food_data(cursor, food_name)
        
        close_connection(connection, cursor)

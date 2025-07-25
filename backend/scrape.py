from backend.db_connection import connect_to_mysql
from backend.app import run_scraping, clear_table, insert_bulk_food_data

def scrape_and_update():
    try:
        with connect_to_mysql() as connection:
            if connection:
                cursor = connection.cursor()

                clear_table(cursor, connection)
                run_scraping(cursor, connection)

                print("Scraping complete. Database has been updated.")
    except Exception as e:
        print(f"Error during scraping: {e}")

if __name__ == "__main__":
    scrape_and_update()

import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv()

def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("RDS_ENDPOINT"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER_RDS"),
            password=os.getenv("DB_PASSWORD")
        )

        if connection.is_connected():
            print("Connected to MySQL")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

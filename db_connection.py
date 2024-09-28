import mysql.connector
from mysql.connector import Error
from config import *

def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host=RDS_ENDPOINT,
            database='nutrition_db',
            user='admin',
            password='iD#193306'
        )
        if connection.is_connected():
            print("Connected to MySQL")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None


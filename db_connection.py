import mysql.connector
from mysql.connector import Error
from config import *

#ssh -i ~/.ssh/foodscraper.pem ec2-user@3.147.72.94 -v
#mysql -h database-foodscraper.cfiaq88i63v6.us-east-2.rds.amazonaws.com -P 3306 -u admin -p

def connect_to_mysql():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='nutrition_db',
            user='root',
            password='iD#193306'
        )
        if connection.is_connected():
            cursor = connection.cursor()
            print("Connected to MySQL")
            return connection, cursor
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None, None

def close_connection(connection, cursor):
    if cursor:
        cursor.close()
    if connection:
        connection.close()
    print("MySQL connection closed")

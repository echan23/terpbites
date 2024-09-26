import mysql.connector
from mysql.connector import Error
from config import *

#ssh -i /Users/edchan/projects/foodscraper/foodscraper.pem ec2-user@3.147.72.94 -v
#mysql -h database-foodscraper.cfiaq88i63v6.us-east-2.rds.amazonaws.com -P 3306 -u admin -p

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


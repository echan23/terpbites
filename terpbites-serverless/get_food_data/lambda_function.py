import json
import os
import mysql.connector
import logging
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    logger.info("Lambda triggered with event: %s", json.dumps(event))
    params = event.get("queryStringParameters", {}) or {}
    print("Query params:", params)
    food_name = params.get("food_name", "").strip()
    location = params.get("location", "").strip()
    limit = int(params.get("limit", 10))

    if not food_name:
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            "body": json.dumps({"error": "Missing 'food_name' parameter"})
        }

    #Worked when hardcoding env, there is some conflict between .env and the lambda env from serverless.yml 
    try:
        conn = mysql.connector.connect(
            host=os.environ["DB_HOST"],
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            database=os.environ["DB_NAME"],
        )
        cursor = conn.cursor()

        query = """
            SELECT * FROM food_items 
            WHERE LOWER(name) LIKE LOWER(%s)
        """
        values = [f"%{food_name}%"]

        if location:
            query += " AND location = %s"
            values.append(location)

        query += " LIMIT %s"
        values.append(limit)

        cursor.execute(query, values)
        rows = cursor.fetchall()

        results = [
            {
                "name": row[1],
                "calories": row[2],
                "protein": row[3],
                "total_fat": row[4],
                "carbs": row[5],
                "sodium": row[6],
                "sugar": row[7],
                "serving_size": row[8],
                "location": row[9],
            }
            for row in rows
        ]

        cursor.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            "body": json.dumps(results)
        }

    except Exception as e:
        logger.exception("❌ Error occurred during DB query")
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "GET"
            },
            "body": json.dumps({"error": str(e)})
        }

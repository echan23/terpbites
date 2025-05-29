import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

try:
    conn = mysql.connector.connect(
        host=os.environ["RDS_ENDPOINT"],
        user=os.environ["DB_USER_RDS"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
    )
    print("✅ Connected to the database")

    cursor = conn.cursor()

    test_data = [
        ('Apple Pie', 400, 3, 20, 50, 300, 25, '1 slice', 'South'),
        ('Grilled Cheese', 450, 15, 30, 30, 700, 6, '1 sandwich', 'North'),
        ('Veggie Wrap', 280, 8, 12, 35, 400, 3, '1 wrap', 'Y')
    ]

    query = """
    INSERT INTO food_items (name, calories, protein, total_fat, carbs, sodium, sugar, serving_size, location)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        calories = VALUES(calories),
        protein = VALUES(protein),
        total_fat = VALUES(total_fat),
        carbs = VALUES(carbs),
        sodium = VALUES(sodium),
        sugar = VALUES(sugar),
        serving_size = VALUES(serving_size),
        location = VALUES(location);
    """

    cursor.executemany(query, test_data)
    conn.commit()
    print("Test data inserted successfully")

except mysql.connector.Error as err:
    print("Database error:", err)

except Exception as e:
    print("General error:", e)

finally:
    try:
        cursor.close()
        conn.close()
    except:
        pass

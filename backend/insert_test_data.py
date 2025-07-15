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
    print("Connected to the database")

    cursor = conn.cursor()

    test_data = [
        ('Apple Pie', 320, 2, 15, 45, 240, 25, '1 slice', 'South'),
        ('Caramel Apple Slices', 260, 1, 9, 40, 150, 30, '1 bowl', 'North'),
        ('Apple Cider', 120, 0, 0, 30, 10, 28, '1 cup', 'Y'),
        ('Apple Cinnamon Oatmeal', 190, 4, 3, 35, 160, 12, '1 bowl', 'South'),
        ('Apple Glazed Pork Chop', 410, 32, 18, 12, 580, 9, '1 chop', 'North'),
        ('Apple Yogurt Parfait', 230, 9, 5, 28, 100, 18, '1 cup', 'Y'),
        ('Baked Apple Chips', 130, 1, 2, 31, 10, 22, '1 bag', 'South'),
        ('Grilled Chicken with Apple Salsa', 450, 38, 14, 20, 520, 6, '1 plate', 'North'),
        ('Apple Crumble', 340, 3, 16, 44, 260, 26, '1 scoop', 'Y'),
        ('Apple Butter Pancakes', 510, 8, 21, 70, 380, 32, '3 pancakes', 'South'),
        ('Warm Apple Danish', 280, 4, 13, 34, 210, 19, '1 pastry', 'North'),
        ('Spicy Chicken Wrap', 420, 28, 15, 35, 850, 4, '1 wrap', 'South'),
        ('Garden Veggie Salad', 220, 5, 8, 30, 310, 6, '1 bowl', 'North'),
        ('Beef Burrito Bowl', 570, 34, 20, 50, 920, 5, '1 bowl', 'Y'),
        ('Classic Cheeseburger', 650, 32, 40, 37, 980, 8, '1 sandwich', 'South'),
        ('Tofu Stir Fry', 390, 18, 12, 42, 510, 10, '1 bowl', 'North'),
        ('Grilled Salmon', 480, 36, 22, 12, 670, 2, '6 oz', 'Y'),
        ('Mac & Cheese', 510, 15, 22, 50, 730, 7, '1 cup', 'South'),
        ('Buffalo Wings', 610, 35, 42, 8, 1100, 0, '6 pieces', 'North'),
        ('Fruit Parfait', 210, 9, 4, 30, 110, 20, '1 cup', 'Y'),
        ('Turkey Sandwich', 430, 27, 14, 38, 680, 5, '1 sandwich', 'South'),
        ('Lentil Soup', 180, 12, 3, 25, 320, 4, '1 bowl', 'North'),
        ('Baked Ziti', 490, 20, 18, 55, 860, 6, '1 tray', 'Y'),
        ('BBQ Pulled Pork', 540, 33, 27, 40, 750, 9, '1 sandwich', 'South'),
        ('Spinach Omelette', 310, 22, 20, 6, 440, 1, '1 omelette', 'North'),
        ('Chocolate Chip Cookie', 160, 2, 8, 24, 140, 16, '1 cookie', 'Y'),
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

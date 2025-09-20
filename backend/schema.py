import sqlite3

connection = sqlite3.connect('backend/database.db')


with open('backend/dataset.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO contacts (name, type, email, mobile, city, state, pincode) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ('John Doe', 'Customer', 'john.doe@example.com', '1234567890', 'New York', 'NY', '10001')
            )

cur.execute("INSERT INTO products (product_name, type, sales_price, purchase_price, hsn_code, category) VALUES (?, ?, ?, ?, ?, ?)",
            ('Laptop', 'Goods', 1200.00, 1000.00, '8471', 'Electronics')
            )

connection.commit()
connection.close()
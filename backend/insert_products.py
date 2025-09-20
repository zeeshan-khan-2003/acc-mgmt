from app import app
from database import db
from schema import Product

with app.app_context():
    # Clear existing products
    Product.query.delete()
    db.session.commit()

    products_data = [
        {
            "product_name": "Laptop",
            "type": "Goods",
            "sales_price": 1200.00,
            "purchase_price": 1000.00,
            "hsn_code": "8471",
            "category": "Electronics"
        },
        {
            "product_name": "Consulting Service",
            "type": "Service",
            "sales_price": 150.00,
            "purchase_price": 50.00,
            "hsn_code": "9983",
            "category": "Services"
        },
        {
            "product_name": "Keyboard",
            "type": "Goods",
            "sales_price": 75.00,
            "purchase_price": 60.00,
            "hsn_code": "8471",
            "category": "Electronics"
        },
        {
            "product_name": "Mouse",
            "type": "Goods",
            "sales_price": 25.00,
            "purchase_price": 15.00,
            "hsn_code": "8471",
            "category": "Electronics"
        },
        {
            "product_name": "Software License",
            "type": "Service",
            "sales_price": 500.00,
            "purchase_price": 300.00,
            "hsn_code": "9984",
            "category": "Software"
        }
    ]

    for product_data in products_data:
        product = Product(**product_data)
        db.session.add(product)

    db.session.commit()
    print("Dummy products inserted successfully.")
from flask import Flask, jsonify
from database import get_db_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    conn = get_db_connection()
    contacts = conn.execute('SELECT * FROM contacts').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in contacts])

@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in products])

if __name__ == '__main__':
    app.run(debug=True)

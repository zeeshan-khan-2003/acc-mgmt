from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from werkzeug.security import generate_password_hash

from database import db
from schema import (
    User, ContactsMaster, ProductMaster, PurchaseOrder, 
    PurchaseOrderItem, TaxesMaster, ChartOfAccountsMaster, SalesOrder, 
    SalesOrderItem, VendorBill, CustomerInvoice, Payment, GeneralLedger
)
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this in your application!

CORS(app)

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    login_id = data.get('login_id', username) # Default login_id to username

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400

    password_hash = generate_password_hash(password)
    new_user = User(username=username, password_hash=password_hash, login_id=login_id)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)

    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/contacts', methods=['GET'])
@jwt_required()
def get_contacts():
    contacts = ContactsMaster.query.all()
    return jsonify([{
        'contact_id': contact.contact_id,
        'name': contact.name,
        'email': contact.email,
        'mobile': contact.mobile,
        'city': contact.city,
        'state': contact.state,
        'pincode': contact.pincode
    } for contact in contacts])

@app.route('/api/contacts', methods=['POST'])
@jwt_required()
def create_contact():
    data = request.get_json()
    name = data.get('name')
    mobile = data.get('mobile')
    email = data.get('email')
    city = data.get('city')

    if not name or not mobile or not email or not city:
        return jsonify({"msg": "Name, mobile, email, and city are required"}), 400

    if ContactsMaster.query.filter_by(email=email).first():
        return jsonify({"msg": "Contact with this email already exists"}), 400

    new_contact = ContactsMaster(
        name=name,
        mobile=mobile,
        email=email,
        city=city
    )
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({"msg": "Contact created successfully", "contact_id": new_contact.contact_id}), 201

@app.route('/api/products', methods=['GET'])
@jwt_required()
def get_products():
    products = ProductMaster.query.all()
    return jsonify([{
        'product_id': product.product_id,
        'product_name': product.product_name,
        'type': product.type,
        'sales_price': product.sales_price,
        'purchase_price': product.purchase_price,
        'purchase_tax': product.purchase_tax,
        'hsn_code': product.hsn_code,
        'category': product.category
    } for product in products])

@app.route('/api/purchase-orders', methods=['POST'])
@jwt_required()
def create_purchase_order():
    data = request.get_json()
    vendor_name = data.get('vendor_name')
    items = data.get('items')
    ref_no = data.get('ref_no')

    if not vendor_name or not items:
        return jsonify({"msg": "Vendor name and items are required"}), 400

    vendor = ContactsMaster.query.filter_by(name=vendor_name).first()
    if not vendor:
        return jsonify({"msg": f"Vendor '{vendor_name}' not found"}), 404

    new_po = PurchaseOrder(
        vendor_id=vendor.contact_id,
        order_date=datetime.utcnow(),
        total_amount=data.get('grand_total'),
        ref_no=ref_no
    )
    db.session.add(new_po)
    db.session.commit()

    for item in items:
        new_item = PurchaseOrderItem(
            po_id=new_po.po_id,
            product_id=item.get('product_id'),
            quantity=item.get('quantity'),
            unit_price=item.get('unit_price')
        )
        db.session.add(new_item)

    db.session.commit()

    return jsonify({"msg": "Purchase order created successfully", "po_id": new_po.po_id}), 201

@app.route('/api/vendor-bill/<int:po_id>', methods=['GET'])
@jwt_required()
def get_vendor_bill(po_id):
    purchase_order = PurchaseOrder.query.get(po_id)
    if not purchase_order:
        return jsonify({"msg": "Purchase Order not found"}), 404

    vendor = ContactsMaster.query.get(purchase_order.vendor_id)
    if not vendor:
        return jsonify({"msg": "Vendor not found"}), 404

    po_items = PurchaseOrderItem.query.filter_by(po_id=po_id).all()
    
    products = []
    for item in po_items:
        product = ProductMaster.query.get(item.product_id)
        if product:
            products.append({
                "name": product.product_name,
                "quantity": item.quantity,
                "price": item.unit_price
            })

    bill_data = {
        "billNo": purchase_order.po_id,
        "vendorName": vendor.name,
        "vendorId": vendor.contact_id,
        "totalAmount": purchase_order.total_amount,
        "reference": f"PO#{purchase_order.po_id}",
        "products": products
    }

    return jsonify(bill_data)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})


@app.route('/api/taxes', methods=['GET'])
@jwt_required()
def get_taxes():
    taxes = TaxesMaster.query.all()
    return jsonify([{
        'tax_id': tax.tax_id,
        'tax_name': tax.tax_name,
        'computation_method': tax.computation_method,
        'rate': tax.rate
    } for tax in taxes])

@app.route('/api/taxes', methods=['POST'])
@jwt_required()
def create_tax():
    data = request.get_json()
    new_tax = TaxesMaster(
        tax_name=data.get('tax_name'),
        computation_method=data.get('computation_method'),
        rate=data.get('rate')
    )
    db.session.add(new_tax)
    db.session.commit()
    return jsonify({"msg": "Tax created successfully", "tax_id": new_tax.tax_id}), 201

@app.route('/api/taxes/<int:tax_id>', methods=['GET'])
@jwt_required()
def get_tax(tax_id):
    tax = TaxesMaster.query.get(tax_id)
    if not tax:
        return jsonify({"msg": "Tax not found"}), 404
    return jsonify({
        'tax_id': tax.tax_id,
        'tax_name': tax.tax_name,
        'computation_method': tax.computation_method,
        'rate': tax.rate
    })

@app.route('/api/taxes/<int:tax_id>', methods=['PUT'])
@jwt_required()
def update_tax(tax_id):
    tax = TaxesMaster.query.get(tax_id)
    if not tax:
        return jsonify({"msg": "Tax not found"}), 404
    data = request.get_json()
    tax.tax_name = data.get('tax_name', tax.tax_name)
    tax.computation_method = data.get('computation_method', tax.computation_method)
    tax.rate = data.get('rate', tax.rate)
    db.session.commit()
    return jsonify({"msg": "Tax updated successfully"})

@app.route('/api/taxes/<int:tax_id>', methods=['DELETE'])
@jwt_required()
def delete_tax(tax_id):
    tax = TaxesMaster.query.get(tax_id)
    if not tax:
        return jsonify({"msg": "Tax not found"}), 404
    db.session.delete(tax)
    db.session.commit()
    return jsonify({"msg": "Tax deleted successfully"})


@app.route('/api/chart-of-accounts', methods=['GET'])
@jwt_required()
def get_chart_of_accounts():
    accounts = ChartOfAccountsMaster.query.all()
    return jsonify([{
        'account_id': account.account_id,
        'account_name': account.account_name,
        'type': account.type
    } for account in accounts])

@app.route('/api/chart-of-accounts', methods=['POST'])
@jwt_required()
def create_chart_of_account():
    data = request.get_json()
    new_account = ChartOfAccountsMaster(
        account_name=data.get('account_name'),
        type=data.get('type')
    )
    db.session.add(new_account)
    db.session.commit()
    return jsonify({"msg": "Chart of Account created successfully", "account_id": new_account.account_id}), 201

@app.route('/api/chart-of-accounts/<int:account_id>', methods=['GET'])
@jwt_required()
def get_chart_of_account(account_id):
    account = ChartOfAccountsMaster.query.get(account_id)
    if not account:
        return jsonify({"msg": "Chart of Account not found"}), 404
    return jsonify({
        'account_id': account.account_id,
        'account_name': account.account_name,
        'type': account.type
    })

@app.route('/api/chart-of-accounts/<int:account_id>', methods=['PUT'])
@jwt_required()
def update_chart_of_account(account_id):
    account = ChartOfAccountsMaster.query.get(account_id)
    if not account:
        return jsonify({"msg": "Chart of Account not found"}), 404
    data = request.get_json()
    account.account_name = data.get('account_name', account.account_name)
    account.type = data.get('type', account.type)
    db.session.commit()
    return jsonify({"msg": "Chart of Account updated successfully"})

@app.route('/api/chart-of-accounts/<int:account_id>', methods=['DELETE'])
@jwt_required()
def delete_chart_of_account(account_id):
    account = ChartOfAccountsMaster.query.get(account_id)
    if not account:
        return jsonify({"msg": "Chart of Account not found"}), 404
    db.session.delete(account)
    db.session.commit()
    return jsonify({"msg": "Chart of Account deleted successfully"})


@app.route('/api/sales-orders', methods=['GET'])
@jwt_required()
def get_sales_orders():
    sales_orders = SalesOrder.query.all()
    return jsonify([{
        'so_id': so.so_id,
        'customer_id': so.customer_id,
        'order_date': so.order_date.isoformat(),
        'status_': so.status_,
        'total_amount': so.total_amount,
        'ref_no': so.ref_no
    } for so in sales_orders])

@app.route('/api/sales-orders', methods=['POST'])
@jwt_required()
def create_sales_order():
    data = request.get_json()
    customer_id = data.get('customer_id')
    items = data.get('items')

    if not customer_id or not items:
        return jsonify({"msg": "Customer ID and items are required"}), 400

    customer = ContactsMaster.query.get(customer_id)
    if not customer:
        return jsonify({"msg": f"Customer with ID '{customer_id}' not found"}), 404

    new_so = SalesOrder(
        customer_id=customer_id,
        order_date=datetime.utcnow(),
        total_amount=data.get('total_amount'),
        ref_no=data.get('ref_no')
    )
    db.session.add(new_so)
    db.session.commit()

    for item_data in items:
        new_so_item = SalesOrderItem(
            so_id=new_so.so_id,
            product_id=item_data.get('product_id'),
            quantity=item_data.get('quantity'),
            unit_price=item_data.get('unit_price'),
            tax_id=item_data.get('tax_id')
        )
        db.session.add(new_so_item)

    db.session.commit()

    return jsonify({"msg": "Sales order created successfully", "so_id": new_so.so_id}), 201

@app.route('/api/sales-orders/<int:so_id>', methods=['GET'])
@jwt_required()
def get_sales_order(so_id):
    sales_order = SalesOrder.query.get(so_id)
    if not sales_order:
        return jsonify({"msg": "Sales Order not found"}), 404

    items = SalesOrderItem.query.filter_by(so_id=so_id).all()
    items_data = [{
        'so_item_id': item.so_item_id,
        'product_id': item.product_id,
        'quantity': item.quantity,
        'unit_price': item.unit_price,
        'tax_id': item.tax_id
    } for item in items]

    return jsonify({
        'so_id': sales_order.so_id,
        'customer_id': sales_order.customer_id,
        'order_date': sales_order.order_date.isoformat(),
        'status_': sales_order.status_,
        'total_amount': sales_order.total_amount,
        'ref_no': sales_order.ref_no,
        'items': items_data
    })

@app.route('/api/sales-orders/<int:so_id>', methods=['PUT'])
@jwt_required()
def update_sales_order(so_id):
    sales_order = SalesOrder.query.get(so_id)
    if not sales_order:
        return jsonify({"msg": "Sales Order not found"}), 404
    data = request.get_json()
    sales_order.customer_id = data.get('customer_id', sales_order.customer_id)
    sales_order.order_date = datetime.fromisoformat(data.get('order_date')) if data.get('order_date') else sales_order.order_date
    sales_order.status_ = data.get('status_', sales_order.status_)
    sales_order.total_amount = data.get('total_amount', sales_order.total_amount)
    sales_order.ref_no = data.get('ref_no', sales_order.ref_no)

    if 'items' in data:
        SalesOrderItem.query.filter_by(so_id=so_id).delete()
        for item_data in data['items']:
            new_so_item = SalesOrderItem(
                so_id=so_id,
                product_id=item_data.get('product_id'),
                quantity=item_data.get('quantity'),
                unit_price=item_data.get('unit_price'),
                tax_id=item_data.get('tax_id')
            )
            db.session.add(new_so_item)

    db.session.commit()
    return jsonify({"msg": "Sales Order updated successfully"})

@app.route('/api/sales-orders/<int:so_id>', methods=['DELETE'])
@jwt_required()
def delete_sales_order(so_id):
    sales_order = SalesOrder.query.get(so_id)
    if not sales_order:
        return jsonify({"msg": "Sales Order not found"}), 404
    
    SalesOrderItem.query.filter_by(so_id=so_id).delete()
    db.session.delete(sales_order)
    db.session.commit()
    return jsonify({"msg": "Sales Order deleted successfully"})


@app.route('/api/vendor-bills', methods=['GET'])
@jwt_required()
def get_vendor_bills():
    vendor_bills = VendorBill.query.all()
    return jsonify([{
        'bill_ref_id': bill.bill_ref_id,
        'po_id': bill.po_id,
        'vendor_id': bill.vendor_id,
        'bill_ref_no': bill.bill_ref_no,
        'bill_date': bill.bill_date.isoformat(),
        'due_date': bill.due_date.isoformat(),
        'total_amount': bill.total_amount,
        'status': bill.status
    } for bill in vendor_bills])

@app.route('/api/vendor-bills', methods=['POST'])
@jwt_required()
def create_vendor_bill():
    data = request.get_json()
    new_bill = VendorBill(
        po_id=data.get('po_id'),
        vendor_id=data.get('vendor_id'),
        bill_date=datetime.fromisoformat(data.get('bill_date')),
        due_date=datetime.fromisoformat(data.get('due_date')),
        total_amount=data.get('total_amount'),
        status=data.get('status', 'Unpaid'),
        bill_ref_no=data.get('bill_ref_no')
    )
    db.session.add(new_bill)
    db.session.commit()
    return jsonify({"msg": "Vendor Bill created successfully", "bill_ref_id": new_bill.bill_ref_id}), 201

@app.route('/api/vendor-bills/<int:bill_ref_id>', methods=['GET'])
@jwt_required()
def get_vendor_bill_by_id(bill_ref_id):
    bill = VendorBill.query.get(bill_ref_id)
    if not bill:
        return jsonify({"msg": "Vendor Bill not found"}), 404
    return jsonify({
        'bill_ref_id': bill.bill_ref_id,
        'po_id': bill.po_id,
        'vendor_id': bill.vendor_id,
        'bill_ref_no': bill.bill_ref_no,
        'bill_date': bill.bill_date.isoformat(),
        'due_date': bill.due_date.isoformat(),
        'total_amount': bill.total_amount,
        'status': bill.status
    })

@app.route('/api/vendor-bills/<int:bill_ref_id>', methods=['PUT'])
@jwt_required()
def update_vendor_bill(bill_ref_id):
    bill = VendorBill.query.get(bill_ref_id)
    if not bill:
        return jsonify({"msg": "Vendor Bill not found"}), 404
    data = request.get_json()
    bill.po_id = data.get('po_id', bill.po_id)
    bill.vendor_id = data.get('vendor_id', bill.vendor_id)
    bill.bill_date = datetime.fromisoformat(data.get('bill_date')) if data.get('bill_date') else bill.bill_date
    bill.due_date = datetime.fromisoformat(data.get('due_date')) if data.get('due_date') else bill.due_date
    bill.total_amount = data.get('total_amount', bill.total_amount)
    bill.status = data.get('status', bill.status)
    bill.bill_ref_no = data.get('bill_ref_no', bill.bill_ref_no)
    db.session.commit()
    return jsonify({"msg": "Vendor Bill updated successfully"})

@app.route('/api/vendor-bills/<int:bill_ref_id>', methods=['DELETE'])
@jwt_required()
def delete_vendor_bill(bill_ref_id):
    bill = VendorBill.query.get(bill_ref_id)
    if not bill:
        return jsonify({"msg": "Vendor Bill not found"}), 404
    db.session.delete(bill)
    db.session.commit()
    return jsonify({"msg": "Vendor Bill deleted successfully"})


@app.route('/api/customer-invoices', methods=['GET'])
@jwt_required()
def get_customer_invoices():
    customer_invoices = CustomerInvoice.query.all()
    return jsonify([{
        'invoice_id': invoice.invoice_id,
        'so_id': invoice.so_id,
        'customer_id': invoice.customer_id,
        'ref_no': invoice.ref_no,
        'invoice_date': invoice.invoice_date.isoformat(),
        'due_date': invoice.due_date.isoformat(),
        'total_amount': invoice.total_amount,
        'status': invoice.status
    } for invoice in customer_invoices])

@app.route('/api/customer-invoices', methods=['POST'])
@jwt_required()
def create_customer_invoice():
    data = request.get_json()
    new_invoice = CustomerInvoice(
        so_id=data.get('so_id'),
        customer_id=data.get('customer_id'),
        invoice_date=datetime.fromisoformat(data.get('invoice_date')),
        due_date=datetime.fromisoformat(data.get('due_date')),
        total_amount=data.get('total_amount'),
        status=data.get('status', 'Unpaid'),
        ref_no=data.get('ref_no')
    )
    db.session.add(new_invoice)
    db.session.commit()
    return jsonify({"msg": "Customer Invoice created successfully", "invoice_id": new_invoice.invoice_id}), 201

@app.route('/api/customer-invoices/<int:invoice_id>', methods=['GET'])
@jwt_required()
def get_customer_invoice(invoice_id):
    invoice = CustomerInvoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"msg": "Customer Invoice not found"}), 404
    return jsonify({
        'invoice_id': invoice.invoice_id,
        'so_id': invoice.so_id,
        'customer_id': invoice.customer_id,
        'ref_no': invoice.ref_no,
        'invoice_date': invoice.invoice_date.isoformat(),
        'due_date': invoice.due_date.isoformat(),
        'total_amount': invoice.total_amount,
        'status': invoice.status
    })

@app.route('/api/customer-invoices/<int:invoice_id>', methods=['PUT'])
@jwt_required()
def update_customer_invoice(invoice_id):
    invoice = CustomerInvoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"msg": "Customer Invoice not found"}), 404
    data = request.get_json()
    invoice.so_id = data.get('so_id', invoice.so_id)
    invoice.customer_id = data.get('customer_id', invoice.customer_id)
    invoice.invoice_date = datetime.fromisoformat(data.get('invoice_date')) if data.get('invoice_date') else invoice.invoice_date
    invoice.due_date = datetime.fromisoformat(data.get('due_date')) if data.get('due_date') else invoice.due_date
    invoice.total_amount = data.get('total_amount', invoice.total_amount)
    invoice.status = data.get('status', invoice.status)
    invoice.ref_no = data.get('ref_no', invoice.ref_no)
    db.session.commit()
    return jsonify({"msg": "Customer Invoice updated successfully"})

@app.route('/api/customer-invoices/<int:invoice_id>', methods=['DELETE'])
@jwt_required()
def delete_customer_invoice(invoice_id):
    invoice = CustomerInvoice.query.get(invoice_id)
    if not invoice:
        return jsonify({"msg": "Customer Invoice not found"}), 404
    db.session.delete(invoice)
    db.session.commit()
    return jsonify({"msg": "Customer Invoice deleted successfully"})


@app.route('/api/payments', methods=['GET'])
@jwt_required()
def get_payments():
    payments = Payment.query.all()
    return jsonify([{
        'payment_id': payment.payment_id,
        'invoice_id': payment.invoice_id,
        'bill_id': payment.bill_id,
        'payment_date': payment.payment_date.isoformat(),
        'amount': payment.amount,
        'payment_method': payment.payment_method,
        'account_id': payment.account_id
    } for payment in payments])

@app.route('/api/payments', methods=['POST'])
@jwt_required()
def create_payment():
    data = request.get_json()
    new_payment = Payment(
        invoice_id=data.get('invoice_id'),
        bill_id=data.get('bill_id'),
        payment_date=datetime.fromisoformat(data.get('payment_date')),
        amount=data.get('amount'),
        payment_method=data.get('payment_method'),
        account_id=data.get('account_id')
    )
    db.session.add(new_payment)
    db.session.commit()
    return jsonify({"msg": "Payment created successfully", "payment_id": new_payment.payment_id}), 201

@app.route('/api/payments/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"msg": "Payment not found"}), 404
    return jsonify({
        'payment_id': payment.payment_id,
        'invoice_id': payment.invoice_id,
        'bill_id': payment.bill_id,
        'payment_date': payment.payment_date.isoformat(),
        'amount': payment.amount,
        'payment_method': payment.payment_method,
        'account_id': payment.account_id
    })

@app.route('/api/payments/<int:payment_id>', methods=['PUT'])
@jwt_required()
def update_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"msg": "Payment not found"}), 404
    data = request.get_json()
    payment.invoice_id = data.get('invoice_id', payment.invoice_id)
    payment.bill_id = data.get('bill_id', payment.bill_id)
    payment.payment_date = datetime.fromisoformat(data.get('payment_date')) if data.get('payment_date') else payment.payment_date
    payment.amount = data.get('amount', payment.amount)
    payment.payment_method = data.get('payment_method', payment.payment_method)
    payment.account_id = data.get('account_id', payment.account_id)
    db.session.commit()
    return jsonify({"msg": "Payment updated successfully"})

@app.route('/api/payments/<int:payment_id>', methods=['DELETE'])
@jwt_required()
def delete_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return jsonify({"msg": "Payment not found"}), 404
    db.session.delete(payment)
    db.session.commit()
    return jsonify({"msg": "Payment deleted successfully"})


@app.route('/api/general-ledger', methods=['GET'])
@jwt_required()
def get_general_ledger_entries():
    entries = GeneralLedger.query.all()
    return jsonify([{
        'entry_id': entry.entry_id,
        'transaction_date': entry.transaction_date.isoformat(),
        'account_id': entry.account_id,
        'debit': entry.debit,
        'credit': entry.credit,
        'description': entry.description,
        'transaction_type': entry.transaction_type,
        'reference_id': entry.reference_id
    } for entry in entries])

@app.route('/api/general-ledger', methods=['POST'])
@jwt_required()
def create_general_ledger_entry():
    data = request.get_json()
    new_entry = GeneralLedger(
        transaction_date=datetime.fromisoformat(data.get('transaction_date')),
        account_id=data.get('account_id'),
        debit=data.get('debit'),
        credit=data.get('credit'),
        description=data.get('description'),
        transaction_type=data.get('transaction_type'),
        reference_id=data.get('reference_id')
    )
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"msg": "General Ledger entry created successfully", "entry_id": new_entry.entry_id}), 201

@app.route('/api/general-ledger/<int:entry_id>', methods=['GET'])
@jwt_required()
def get_general_ledger_entry(entry_id):
    entry = GeneralLedger.query.get(entry_id)
    if not entry:
        return jsonify({"msg": "General Ledger entry not found"}), 404
    return jsonify({
        'entry_id': entry.entry_id,
        'transaction_date': entry.transaction_date.isoformat(),
        'account_id': entry.account_id,
        'debit': entry.debit,
        'credit': entry.credit,
        'description': entry.description,
        'transaction_type': entry.transaction_type,
        'reference_id': entry.reference_id
    })

@app.route('/api/general-ledger/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_general_ledger_entry(entry_id):
    entry = GeneralLedger.query.get(entry_id)
    if not entry:
        return jsonify({"msg": "General Ledger entry not found"}), 404
    data = request.get_json()
    entry.transaction_date = datetime.fromisoformat(data.get('transaction_date')) if data.get('transaction_date') else entry.transaction_date
    entry.account_id = data.get('account_id', entry.account_id)
    entry.debit = data.get('debit', entry.debit)
    entry.credit = data.get('credit', entry.credit)
    entry.description = data.get('description', entry.description)
    entry.transaction_type = data.get('transaction_type', entry.transaction_type)
    entry.reference_id = data.get('reference_id', entry.reference_id)
    db.session.commit()
    return jsonify({"msg": "General Ledger entry updated successfully"})

@app.route('/api/general-ledger/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_general_ledger_entry(entry_id):
    entry = GeneralLedger.query.get(entry_id)
    if not entry:
        return jsonify({"msg": "General Ledger entry not found"}), 404
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"msg": "General Ledger entry deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)

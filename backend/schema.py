
from werkzeug.security import check_password_hash
from database import db

class Contact(db.Model):
    __tablename__ = 'contacts'
    contact_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True)
    mobile = db.Column(db.String)
    city = db.Column(db.String)
    state = db.Column(db.String)
    pincode = db.Column(db.String)
    profile_image = db.Column(db.String)

class Product(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    sales_price = db.Column(db.Float)
    purchase_price = db.Column(db.Float)
    hsn_code = db.Column(db.String)
    category = db.Column(db.String)

class Tax(db.Model):
    __tablename__ = 'taxes'
    tax_id = db.Column(db.Integer, primary_key=True)
    tax_name = db.Column(db.String, nullable=False)
    computation_method = db.Column(db.String, nullable=False)
    rate = db.Column(db.Float)
    applicable_on = db.Column(db.String, nullable=False)

class ChartOfAccount(db.Model):
    __tablename__ = 'chart_of_accounts'
    account_id = db.Column(db.Integer, primary_key=True)
    account_name = db.Column(db.String, nullable=False, unique=True)
    type = db.Column(db.String, nullable=False)

class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    loginId = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password_hash = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.contact_id'))

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class PurchaseOrder(db.Model):
    __tablename__ = 'purchase_orders'
    po_id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('contacts.contact_id'), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String, default='Draft')
    total_amount = db.Column(db.Float)

class PurchaseOrderItem(db.Model):
    __tablename__ = 'purchase_order_items'
    po_item_id = db.Column(db.Integer, primary_key=True)
    po_id = db.Column(db.Integer, db.ForeignKey('purchase_orders.po_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    tax_id = db.Column(db.Integer, db.ForeignKey('taxes.tax_id'))

class VendorBill(db.Model):
    __tablename__ = 'vendor_bills'
    bill_id = db.Column(db.Integer, primary_key=True)
    po_id = db.Column(db.Integer, db.ForeignKey('purchase_orders.po_id'))
    vendor_id = db.Column(db.Integer, db.ForeignKey('contacts.contact_id'), nullable=False)
    bill_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, default='Unpaid')

class SalesOrder(db.Model):
    __tablename__ = 'sales_orders'
    so_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('contacts.contact_id'), nullable=False)
    order_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.String, default='Draft')
    total_amount = db.Column(db.Float)

class SalesOrderItem(db.Model):
    __tablename__ = 'sales_order_items'
    so_item_id = db.Column(db.Integer, primary_key=True)
    so_id = db.Column(db.Integer, db.ForeignKey('sales_orders.so_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    tax_id = db.Column(db.Integer, db.ForeignKey('taxes.tax_id'))

class CustomerInvoice(db.Model):
    __tablename__ = 'customer_invoices'
    invoice_id = db.Column(db.Integer, primary_key=True)
    so_id = db.Column(db.Integer, db.ForeignKey('sales_orders.so_id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('contacts.contact_id'), nullable=False)
    invoice_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, default='Unpaid')

class Payment(db.Model):
    __tablename__ = 'payments'
    payment_id = db.Column(db.Integer, primary_key=True)
    invoice_id = db.Column(db.Integer, db.ForeignKey('customer_invoices.invoice_id'))
    bill_id = db.Column(db.Integer, db.ForeignKey('vendor_bills.bill_id'))
    payment_date = db.Column(db.Date, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('chart_of_accounts.account_id'))

class Inventory(db.Model):
    __tablename__ = 'inventory'
    inventory_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False, unique=True)
    quantity_on_hand = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.TIMESTAMP, default=db.func.current_timestamp())

class GeneralLedger(db.Model):
    __tablename__ = 'general_ledger'
    entry_id = db.Column(db.Integer, primary_key=True)
    transaction_date = db.Column(db.Date, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('chart_of_accounts.account_id'), nullable=False)
    debit = db.Column(db.Float)
    credit = db.Column(db.Float)
    description = db.Column(db.String)
    transaction_type = db.Column(db.String)
    reference_id = db.Column(db.Integer)

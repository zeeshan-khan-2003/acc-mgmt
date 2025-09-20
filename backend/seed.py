from app import app
from database import db
from schema import (
    User, ContactsMaster, ProductMaster, PurchaseOrder, 
    PurchaseOrderItem, TaxesMaster, ChartOfAccountsMaster, SalesOrder, 
    SalesOrderItem, VendorBill, CustomerInvoice, Payment, GeneralLedger
)
from werkzeug.security import generate_password_hash
from datetime import datetime

with app.app_context():
    # Clear existing data
    GeneralLedger.query.delete()
    Payment.query.delete()
    CustomerInvoice.query.delete()
    SalesOrderItem.query.delete()
    SalesOrder.query.delete()
    VendorBill.query.delete()
    PurchaseOrderItem.query.delete()
    PurchaseOrder.query.delete()
    User.query.delete()
    ContactsMaster.query.delete()
    ProductMaster.query.delete()
    ChartOfAccountsMaster.query.delete()
    TaxesMaster.query.delete()
    db.session.commit()

    # Create User
    password_hash = generate_password_hash('password')
    new_user = User(username='testuser', password_hash=password_hash, login_id='testuser')
    db.session.add(new_user)
    db.session.commit()

    # Create Contacts
    customer = ContactsMaster(name='Customer A', email='customer@example.com', mobile='1234567890', city='City A', state='State A', pincode='12345')
    vendor = ContactsMaster(name='Vendor B', email='vendor@example.com', mobile='0987654321', city='City B', state='State B', pincode='54321')
    db.session.add_all([customer, vendor])
    db.session.commit()

    # Create Chart of Accounts
    accounts = [
        ChartOfAccountsMaster(account_name='Sales', type='Income'),
        ChartOfAccountsMaster(account_name='Cost of Goods Sold', type='Expense'),
        ChartOfAccountsMaster(account_name='Bank', type='Asset'),
        ChartOfAccountsMaster(account_name='Accounts Receivable', type='Asset'),
        ChartOfAccountsMaster(account_name='Accounts Payable', type='Liability'),
        ChartOfAccountsMaster(account_name='Owner Equity', type='Equity')
    ]
    db.session.add_all(accounts)
    db.session.commit()

    sales_account = ChartOfAccountsMaster.query.filter_by(account_name='Sales').first()
    cogs_account = ChartOfAccountsMaster.query.filter_by(account_name='Cost of Goods Sold').first()
    bank_account = ChartOfAccountsMaster.query.filter_by(account_name='Bank').first()
    ar_account = ChartOfAccountsMaster.query.filter_by(account_name='Accounts Receivable').first()
    ap_account = ChartOfAccountsMaster.query.filter_by(account_name='Accounts Payable').first()

    # Create Products
    product1 = ProductMaster(product_name='Product 1', type='Goods', sales_price=100, purchase_price=70, category='Category 1')
    product2 = ProductMaster(product_name='Product 2', type='Goods', sales_price=200, purchase_price=150, category='Category 2')
    db.session.add_all([product1, product2])
    db.session.commit()

    # Create a Sale
    sales_order = SalesOrder(customer_id=customer.contact_id, order_date=datetime.utcnow(), total_amount=300)
    db.session.add(sales_order)
    db.session.commit()
    so_item1 = SalesOrderItem(so_id=sales_order.so_id, product_id=product1.product_id, quantity=1, unit_price=100)
    so_item2 = SalesOrderItem(so_id=sales_order.so_id, product_id=product2.product_id, quantity=1, unit_price=200)
    db.session.add_all([so_item1, so_item2])
    db.session.commit()

    customer_invoice = CustomerInvoice(so_id=sales_order.so_id, customer_id=customer.contact_id, invoice_date=datetime.utcnow(), due_date=datetime.utcnow(), total_amount=300)
    db.session.add(customer_invoice)
    db.session.commit()

    # General Ledger for Sales Invoice
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=ar_account.account_id, debit=300, description='Invoice #{}'.format(customer_invoice.invoice_id), transaction_type='CustomerInvoice', reference_id=customer_invoice.invoice_id))
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=sales_account.account_id, credit=300, description='Invoice #{}'.format(customer_invoice.invoice_id), transaction_type='CustomerInvoice', reference_id=customer_invoice.invoice_id))
    db.session.commit()
    
    # Create a Purchase
    purchase_order = PurchaseOrder(vendor_id=vendor.contact_id, order_date=datetime.utcnow(), total_amount=220)
    db.session.add(purchase_order)
    db.session.commit()
    po_item1 = PurchaseOrderItem(po_id=purchase_order.po_id, product_id=product1.product_id, quantity=1, unit_price=70)
    po_item2 = PurchaseOrderItem(po_id=purchase_order.po_id, product_id=product2.product_id, quantity=1, unit_price=150)
    db.session.add_all([po_item1, po_item2])
    db.session.commit()

    vendor_bill = VendorBill(po_id=purchase_order.po_id, vendor_id=vendor.contact_id, bill_date=datetime.utcnow(), due_date=datetime.utcnow(), total_amount=220)
    db.session.add(vendor_bill)
    db.session.commit()

    # General Ledger for Vendor Bill
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=cogs_account.account_id, debit=220, description='Bill #{}'.format(vendor_bill.bill_ref_id), transaction_type='VendorBill', reference_id=vendor_bill.bill_ref_id))
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=ap_account.account_id, credit=220, description='Bill #{}'.format(vendor_bill.bill_ref_id), transaction_type='VendorBill', reference_id=vendor_bill.bill_ref_id))
    db.session.commit()

    # Create Payments
    payment_in = Payment(invoice_id=customer_invoice.invoice_id, payment_date=datetime.utcnow(), amount=300, payment_method='Bank', account_id=bank_account.account_id)
    db.session.add(payment_in)
    db.session.commit()
    
    # General Ledger for Incoming Payment
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=bank_account.account_id, debit=300, description='Payment for Invoice #{}'.format(customer_invoice.invoice_id), transaction_type='Payment', reference_id=payment_in.payment_id))
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=ar_account.account_id, credit=300, description='Payment for Invoice #{}'.format(customer_invoice.invoice_id), transaction_type='Payment', reference_id=payment_in.payment_id))
    db.session.commit()

    payment_out = Payment(bill_id=vendor_bill.bill_ref_id, payment_date=datetime.utcnow(), amount=220, payment_method='Bank', account_id=bank_account.account_id)
    db.session.add(payment_out)
    db.session.commit()

    # General Ledger for Outgoing Payment
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=ap_account.account_id, debit=220, description='Payment for Bill #{}'.format(vendor_bill.bill_ref_id), transaction_type='Payment', reference_id=payment_out.payment_id))
    db.session.add(GeneralLedger(transaction_date=datetime.utcnow(), account_id=bank_account.account_id, credit=220, description='Payment for Bill #{}'.format(vendor_bill.bill_ref_id), transaction_type='Payment', reference_id=payment_out.payment_id))
    db.session.commit()

    print("Database seeded successfully.")

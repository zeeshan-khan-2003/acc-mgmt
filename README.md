
# Odoo - Accounting/ERP System

This project is a comprehensive accounting and ERP system.

- **Backend**: Python with Flask and SQLAlchemy
- **Frontend**: Next.js
- **Features**:
    - User authentication and management
    - Contacts and product management
    - Purchase and sales order management
    - Vendor bills and customer invoices
    - Payments and general ledger
    - Financial reporting (Balance Sheet, P&L)

## Database Schema

```mermaid
erDiagram
    Contacts_Master {
        int contact_id PK
        string name
        string email
        string mobile
        string city
        string state
        string pincode
    }

    Product_Master {
        int product_id PK
        string product_name
        string type
        float sales_price
        float purchase_price
        float purchase_tax
        string hsn_code
        string category
    }

    Taxes_Master {
        int tax_id PK
        string tax_name
        string computation_method
        float rate
    }

    chart_of_accounts_Master {
        int account_id PK
        string account_name
        string type
    }

    users {
        int user_id PK
        string login_id
        string username
        string password_hash
        int contact_id FK
    }

    purchase_orders {
        int po_id PK
        int vendor_id FK
        date order_date
        string ref_no
        string status
        float total_amount
    }

    purchase_order_items {
        int po_item_id PK
        int po_id FK
        int product_id FK
        int quantity
        float unit_price
        int tax_id FK
    }

    vendor_bills {
        int bill_ref_id PK
        int po_id FK
        int vendor_id FK
        string bill_ref_no
        date bill_date
        date due_date
        float total_amount
        string status
    }

    sales_orders {
        int so_id PK
        int customer_id FK
        string ref_no
        date order_date
        float total_amount
        bool status_
    }

    sales_order_items {
        int so_item_id PK
        int so_id FK
        int product_id FK
        int quantity
        float unit_price
        int tax_id FK
    }

    customer_invoices {
        int invoice_id PK
        int so_id FK
        int customer_id FK
        string ref_no
        date invoice_date
        date due_date
        float total_amount
        string status
    }

    payments {
        int payment_id PK
        int invoice_id FK
        int bill_id FK
        date payment_date
        float amount
        string payment_method
        int account_id FK
    }

    general_ledger {
        int entry_id PK
        date transaction_date
        int account_id FK
        float debit
        float credit
        string description
        string transaction_type
        int reference_id
    }

    users }o--|| Contacts_Master : "contact_id"
    purchase_orders }o--|| Contacts_Master : "vendor_id"
    purchase_order_items }o--|| purchase_orders : "po_id"
    purchase_order_items }o--|| Product_Master : "product_id"
    purchase_order_items }o--|| Taxes_Master : "tax_id"
    vendor_bills }o--|| purchase_orders : "po_id"
    vendor_bills }o--|| Contacts_Master : "vendor_id"
    sales_orders }o--|| Contacts_Master : "customer_id"
    sales_order_items }o--|| sales_orders : "so_id"
    sales_order_items }o--|| Product_Master : "product_id"
    sales_order_items }o--|| Taxes_Master : "tax_id"
    customer_invoices }o--|| sales_orders : "so_id"
    customer_invoices }o--|| Contacts_Master : "customer_id"
    payments }o--|| customer_invoices : "invoice_id"
    payments }o--|| vendor_bills : "bill_id"
    payments }o--|| chart_of_accounts_Master : "account_id"
    general_ledger }o--|| chart_of_accounts_Master : "account_id"

```

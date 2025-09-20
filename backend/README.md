# Odoo - Accounting/ERP System - Backend

This document provides a detailed explanation of the backend for the Odoo - Accounting/ERP System project.

## Backend Logic

The backend is a powerful Flask application that provides a wide range of accounting and ERP functionalities.

- **Flask and SQLAlchemy**: The backend is built with Flask and uses SQLAlchemy for database interaction.
- **Database Schema**: The database schema is extensive and includes tables for:
  - `ContactsMaster`: Stores contact information for customers and vendors.
  - `ProductMaster`: Stores product information.
  - `TaxesMaster`: Stores tax information.
  - `ChartOfAccountsMaster`: Stores the chart of accounts.
  - `User`: Stores user information.
  - `PurchaseOrder` and `PurchaseOrderItem`: Manage purchase orders.
  - `SalesOrder` and `SalesOrderItem`: Manage sales orders.
  - `VendorBill`: Manages vendor bills.
  - `CustomerInvoice`: Manages customer invoices.
  - `Payment`: Manages payments.
  - `GeneralLedger`: Stores all accounting entries.
- **API Endpoints**: The backend provides a comprehensive set of API endpoints for CRUD (Create, Read, Update, Delete) operations on all the database tables.
- **Business Logic**: The backend implements business logic for:
  - Creating and managing purchase and sales orders.
  - Generating vendor bills and customer invoices.
  - Recording payments.
  - Generating financial reports like the Balance Sheet and Profit & Loss statement.

## Database Structure

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

## API Routes

### Authentication

- `POST /register`: Register a new user.
- `POST /login`: Log in a user and get a JWT token.

### Contacts

- `GET /api/contacts`: Get all contacts.
- `POST /api/contacts`: Create a new contact.

### Products

- `GET /api/products`: Get all products.
- `POST /api/products`: Create a new product.

### Purchase Orders

- `GET /api/purchase-orders`: Get all purchase orders.
- `POST /api/purchase-orders`: Create a new purchase order.
- `GET /api/vendor-bill/<int:po_id>`: Get vendor bill details for a purchase order.

### Taxes

- `GET /api/taxes`: Get all taxes.
- `POST /api/taxes`: Create a new tax.
- `GET /api/taxes/<int:tax_id>`: Get a specific tax.
- `PUT /api/taxes/<int:tax_id>`: Update a tax.
- `DELETE /api/taxes/<int:tax_id>`: Delete a tax.

### Chart of Accounts

- `GET /api/chart-of-accounts`: Get all accounts.
- `POST /api/chart-of-accounts`: Create a new account.
- `GET /api/chart-of-accounts/<int:account_id>`: Get a specific account.
- `PUT /api/chart-of-accounts/<int:account_id>`: Update an account.
- `DELETE /api/chart-of-accounts/<int:account_id>`: Delete an account.

### Sales Orders

- `GET /api/sales-orders`: Get all sales orders.
- `POST /api/sales-orders`: Create a new sales order.
- `GET /api/sales-orders/<int:so_id>`: Get a specific sales order.
- `PUT /api/sales-orders/<int:so_id>`: Update a sales order.
- `DELETE /api/sales-orders/<int:so_id>`: Delete a sales order.

### Vendor Bills

- `GET /api/vendor-bills`: Get all vendor bills.
- `POST /api/vendor-bills`: Create a new vendor bill.
- `GET /api/vendor-bills/<int:bill_ref_id>`: Get a specific vendor bill.
- `PUT /api/vendor-bills/<int:bill_ref_id>`: Update a vendor bill.
- `DELETE /api/vendor-bills/<int:bill_ref_id>`: Delete a vendor bill.

### Customer Invoices

- `GET /api/customer-invoices`: Get all customer invoices.
- `POST /api/customer-invoices`: Create a new customer invoice.
- `GET /api/customer-invoices/<int:invoice_id>`: Get a specific customer invoice.
- `PUT /api/customer-invoices/<int:invoice_id>`: Update a customer invoice.
- `DELETE /api/customer-invoices/<int:invoice_id>`: Delete a customer invoice.

### Payments

- `GET /api/payments`: Get all payments.
- `POST /api/payments`: Create a new payment.
- `GET /api/payments/<int:payment_id>`: Get a specific payment.
- `PUT /api/payments/<int:payment_id>`: Update a payment.
- `DELETE /api/payments/<int:payment_id>`: Delete a payment.

### General Ledger

- `GET /api/general-ledger`: Get all general ledger entries.
- `POST /api/general-ledger`: Create a new general ledger entry.
- `GET /api/general-ledger/<int:entry_id>`: Get a specific general ledger entry.
- `PUT /api/general-ledger/<int:entry_id>`: Update a general ledger entry.
- `DELETE /api/general-ledger/<int:entry_id>`: Delete a general ledger entry.

### Financial Reports

- `GET /api/balance-sheet`: Get the balance sheet.
- `GET /api/pnl`: Get the profit and loss statement.

### Miscellaneous

- `GET /health`: Health check endpoint.
- `GET /api/hsn-codes`: Get a list of HSN codes.
- `GET /api/categories`: Get a list of product categories.

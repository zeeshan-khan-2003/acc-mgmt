
CREATE TABLE Contacts_Master (
    contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    -- type TEXT CHECK(type IN ('Customer', 'Vendor', )) NOT NULL,
    email TEXT UNIQUE,
    mobile TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
);

CREATE TABLE Product_Master (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    type TEXT CHECK(type IN ('Goods', 'Service')) NOT NULL,
    sales_price REAL,
    purchase_price REAL,
    purchase_tax REAL,
    hsn_code TEXT,
    category TEXT
);

CREATE TABLE Taxes_Master (
    tax_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tax_name TEXT NOT NULL,
    computation_method TEXT CHECK(computation_method IN ('Percentage', 'Fixed Value')) NOT NULL,
    rate REAL,
    -- applicable_on TEXT CHECK(applicable_on IN ('Sales', 'Purchase', 'Both')) NOT NULL
);

CREATE TABLE chart_of_accounts_Master (
    account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_name TEXT NOT NULL UNIQUE,
    type TEXT CHECK(type IN ('Asset', 'Liability', 'Expense', 'Income', 'Equity')) NOT NULL
);

CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    -- role TEXT CHECK(role IN ('Admin', 'Invoicing User', 'Contact')) NOT NULL,
    contact_id INTEGER,
    FOREIGN KEY (contact_id) REFERENCES Contacts_Master(contact_id)
);

-- TRANSACTION TABLES

CREATE TABLE purchase_orders (
    po_id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_id INTEGER NOT NULL,
    order_date DATE NOT NULL DEFAULT (date('now')),
    ref_no INTEGER AUTOINCREMENT,
    ref_no VARCHAR(10) GENERATED ALWAYS AS (CONCAT('REFB-', LPAD(ref_id, 4, '0'))) STORED,

    status TEXT CHECK(status IN ('Draft', 'Sent', 'Billed', 'Cancelled')) DEFAULT 'Draft',
    total_amount REAL,
    FOREIGN KEY (vendor_id) REFERENCES Contacts_Master(contact_id)
);

CREATE TABLE purchase_order_items (
    po_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    tax_id INTEGER,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id),
    FOREIGN KEY (product_id) REFERENCES Product_Master(product_id),
    FOREIGN KEY (tax_id) REFERENCES Taxes_Master(tax_id)
);

CREATE TABLE vendor_bills (
    bill_ref_id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_id INTEGER,
    vendor_id INTEGER NOT NULL,
    bill_ref_no INTEGER AUTOINCREMENT,
    bill_ref_no VARCHAR(10) GENERATED ALWAYS AS (CONCAT('SUP-', LPAD(ref_id, 4, '0'))) STORED,

    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT CHECK(status IN ('Unpaid', 'Partially Paid', 'Paid')) DEFAULT 'Unpaid',
    FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id),
    FOREIGN KEY (vendor_id) REFERENCES Contacts_Master(contact_id)
);

CREATE TABLE sales_orders (
    so_id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,

    ref_no INTEGER AUTOINCREMENT,
    ref_no VARCHAR(10) GENERATED ALWAYS AS (CONCAT('REFS-', LPAD(ref_id, 4, '0'))) STORED,

    order_date DATE NOT NULL DEFAULT (date('now')),
    -- status TEXT CHECK(status IN ('Draft', 'Confirmed', 'Invoiced', 'Cancelled')) DEFAULT 'Draft',
    total_amount REAL,
    status_ BOOLEAN DEFAULT FALSE, 
    FOREIGN KEY (customer_id) REFERENCES Contacts_Master(contact_id)
);

CREATE TABLE sales_order_items (
    so_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    so_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL,
    tax_id INTEGER,
    FOREIGN KEY (so_id) REFERENCES sales_orders(so_id),
    FOREIGN KEY (product_id) REFERENCES Product_Master(product_id),
    FOREIGN KEY (tax_id) REFERENCES Taxes_Master(tax_id)
);

CREATE TABLE customer_invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    so_id INTEGER,
    customer_id INTEGER NOT NULL,

    ref_no INTEGER AUTOINCREMENT,
    ref_no VARCHAR(10) GENERATED ALWAYS AS (CONCAT('RETL-', LPAD(ref_id, 4, '0'))) STORED,

    status_ BOOLEAN DEFAULT FALSE, 
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT CHECK(status IN ('Unpaid', 'Partially Paid', 'Paid')) DEFAULT 'Unpaid',
    FOREIGN KEY (so_id) REFERENCES sales_orders(so_id),
    FOREIGN KEY (customer_id) REFERENCES Contacts_Master(contact_id)
);

CREATE TABLE payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    bill_id INTEGER,
    payment_date DATE NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT CHECK(payment_method IN ('Cash', 'Bank')) NOT NULL,
    account_id INTEGER,
    FOREIGN KEY (invoice_id) REFERENCES customer_invoices(invoice_id),
    FOREIGN KEY (bill_id) REFERENCES vendor_bills(bill_id),
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts_Master(account_id),
    CHECK (invoice_id IS NOT NULL OR bill_id IS NOT NULL)
);

-- OTHER TABLES

CREATE TABLE general_ledger (
    entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_date DATE NOT NULL,
    account_id INTEGER NOT NULL,
    debit REAL,
    credit REAL,
    description TEXT,
    transaction_type TEXT,
    reference_id INTEGER,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(account_id)
);

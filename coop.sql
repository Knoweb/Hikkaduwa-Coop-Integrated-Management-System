-- ==============================================================================
-- INITIALIZATION
-- ==============================================================================
-- Enable UUID extension for secure, distributed primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create isolated schemas for each microservice domain
CREATE SCHEMA IF NOT EXISTS schema_admin;
CREATE SCHEMA IF NOT EXISTS schema_milk_shop;
CREATE SCHEMA IF NOT EXISTS schema_beer_garden;
CREATE SCHEMA IF NOT EXISTS schema_room_section;

-- ==============================================================================
-- 1. ADMIN & IAM SCHEMA (schema_admin)
-- ==============================================================================

CREATE TABLE schema_admin.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., ROLE_MILK_SHOP_OPERATOR, ROLE_SUPER_ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_admin.utility_bill (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utility_type VARCHAR(50) NOT NULL, -- ELECTRICITY, WATER
    billing_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    total_amount DECIMAL(12, 2) NOT NULL,
    milk_shop_ratio DECIMAL(3, 2) NOT NULL, -- e.g., 0.40
    room_section_ratio DECIMAL(3, 2) NOT NULL, -- e.g., 0.60
    recorded_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_admin.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    service_name VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 2. MILK SHOP SCHEMA (schema_milk_shop)
-- ==============================================================================

CREATE TABLE schema_milk_shop.supplier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE schema_milk_shop.item_product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    reorder_level INT NOT NULL DEFAULT 10,
    unit_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE schema_milk_shop.stock_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES schema_milk_shop.item_product(id),
    current_qty INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_milk_shop.purchase_invoice ( -- Represents Goods Received Note (GRN)
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES schema_milk_shop.supplier(id),
    total_amount DECIMAL(12, 2) NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- new table to link purchase invoices to their line items
CREATE TABLE IF NOT EXISTS schema_milk_shop.purchase_invoice_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_invoice_id UUID NOT NULL REFERENCES schema_milk_shop.purchase_invoice(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES schema_milk_shop.item_product(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(12, 2) NOT NULL
);

CREATE TABLE schema_milk_shop.daily_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sales_date DATE UNIQUE NOT NULL,
    total_sales_value DECIMAL(12, 2) NOT NULL,
    cash_handed_over DECIMAL(12, 2) NOT NULL,
    discrepancy DECIMAL(10, 2) DEFAULT 0.00,
    operator_id UUID NOT NULL, -- Soft reference to admin.users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. BEER GARDEN SCHEMA (schema_beer_garden)
-- ==============================================================================

CREATE TABLE schema_beer_garden.beer_price_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beer_name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    effective_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE schema_beer_garden.issuance_invoice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL, -- Soft reference to restaurant entity if managed
    total_liquor_value DECIMAL(12, 2) NOT NULL,
    commission_total DECIMAL(10, 2) NOT NULL,
    grand_total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID', -- UNPAID, PARTIAL, PAID, OVERDUE
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schema_beer_garden.payment_record (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES schema_beer_garden.issuance_invoice(id),
    amount_paid DECIMAL(12, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- CASH, CHEQUE
    cheque_ref VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. ROOM SECTION SCHEMA (schema_room_section)
-- ==============================================================================

CREATE TABLE schema_room_section.room (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type VARCHAR(20) NOT NULL, -- AC, NON_AC
    base_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' -- AVAILABLE, OCCUPIED, MAINTENANCE
);

CREATE TABLE schema_room_section.guest_booking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id UUID NOT NULL REFERENCES schema_room_section.room(id),
    guest_name VARCHAR(100) NOT NULL,
    nic_passport VARCHAR(50) NOT NULL,
    check_in TIMESTAMP NOT NULL,
    check_out TIMESTAMP,
    advance_payment DECIMAL(10, 2) DEFAULT 0.00,
    sub_total DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL, -- VAT + SSCL
    total_due DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' -- ACTIVE, CHECKED_OUT, CANCELLED
);

CREATE TABLE schema_room_section.daily_remittance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remittance_date DATE UNIQUE NOT NULL,
    total_collected DECIMAL(12, 2) NOT NULL,
    receptionist_id UUID NOT NULL, -- Soft reference to admin.users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- INDEXING FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX idx_milk_sales_date ON schema_milk_shop.daily_sales(sales_date);
CREATE INDEX idx_beer_invoice_status ON schema_beer_garden.issuance_invoice(status);
CREATE INDEX idx_room_booking_dates ON schema_room_section.guest_booking(check_in, check_out);
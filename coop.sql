--
-- PostgreSQL database dump
--

\restrict 1zufjkkp5uvRkUSM3DCed0pEmbIMvKadTlWeIsmDt5ZjkB9NZup5r40ZZksU52q

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: schema_admin; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA schema_admin;


--
-- Name: schema_beer_garden; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA schema_beer_garden;


--
-- Name: schema_milk_shop; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA schema_milk_shop;


--
-- Name: schema_room_section; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA schema_room_section;


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log; Type: TABLE; Schema: schema_admin; Owner: -
--

CREATE TABLE schema_admin.audit_log (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    service_name character varying(50) NOT NULL,
    action character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: audit_observation; Type: TABLE; Schema: schema_admin; Owner: -
--

CREATE TABLE schema_admin.audit_observation (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    auditor_id character varying(100) NOT NULL,
    module character varying(50) NOT NULL,
    entity_type character varying(100),
    entity_id uuid,
    reference_number character varying(100),
    title character varying(255) NOT NULL,
    comment text NOT NULL,
    observation_type character varying(50) NOT NULL,
    severity character varying(20) NOT NULL,
    status character varying(20) NOT NULL,
    admin_response text,
    responded_by character varying(100),
    responded_at timestamp without time zone,
    resolved_by character varying(100),
    resolved_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: schema_admin; Owner: -
--

CREATE TABLE schema_admin.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(150) NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: utility_bill; Type: TABLE; Schema: schema_admin; Owner: -
--

CREATE TABLE schema_admin.utility_bill (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    utility_type character varying(50) NOT NULL,
    billing_month character varying(7) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    milk_shop_ratio numeric(3,2) NOT NULL,
    room_section_ratio numeric(3,2) NOT NULL,
    recorded_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: beer_garden_grn; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.beer_garden_grn (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grn_number character varying(255),
    supplier_name character varying(255),
    received_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_amount numeric(38,2),
    amount_paid numeric(38,2) DEFAULT 0.00,
    status character varying(255)
);


--
-- Name: beer_items; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.beer_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    item_code character varying(255) NOT NULL,
    beer_name character varying(255) NOT NULL,
    category character varying(255),
    current_stock integer DEFAULT 0 NOT NULL,
    unit_price numeric(38,2)
);


--
-- Name: beer_price_list; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.beer_price_list (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    beer_item_id uuid NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    effective_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    authorized_by character varying(255) NOT NULL
);


--
-- Name: grn_item; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.grn_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grn_invoice_id uuid NOT NULL,
    beer_item_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_cost numeric(38,2) NOT NULL,
    line_total numeric(38,2) NOT NULL,
    CONSTRAINT grn_item_quantity_check CHECK ((quantity > 0)),
    CONSTRAINT grn_item_unit_cost_check CHECK ((unit_cost >= (0)::numeric))
);


--
-- Name: issuance_invoice; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.issuance_invoice (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_number character varying(50) NOT NULL,
    operator_name character varying(150) NOT NULL,
    issued_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total_stock_value numeric(12,2) DEFAULT 0.00 NOT NULL,
    total_commission numeric(12,2) DEFAULT 0.00 NOT NULL,
    grand_total numeric(12,2) DEFAULT 0.00 NOT NULL,
    issued_by_role character varying(255) NOT NULL,
    status character varying(255),
    priority_level character varying(255) DEFAULT 'MEDIUM'::character varying
);


--
-- Name: issuance_item; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.issuance_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    beer_item_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    commission_per_bottle numeric(12,2) NOT NULL,
    line_total numeric(12,2) NOT NULL
);


--
-- Name: payment_record; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.payment_record (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    amount_paid numeric(38,2) NOT NULL,
    payment_method character varying(255) NOT NULL,
    reference_number character varying(50),
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cheque_ref character varying(255)
);


--
-- Name: supplier_payments; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.supplier_payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    supplier_id uuid NOT NULL,
    grn_invoice_id uuid,
    payment_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    amount numeric(38,2) NOT NULL,
    payment_reference character varying(255),
    CONSTRAINT supplier_payments_amount_check CHECK ((amount > (0)::numeric))
);


--
-- Name: suppliers; Type: TABLE; Schema: schema_beer_garden; Owner: -
--

CREATE TABLE schema_beer_garden.suppliers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    supplier_name character varying(255) NOT NULL,
    license_number character varying(255),
    territory character varying(255),
    contact_details character varying(255),
    credit_terms character varying(255),
    outstanding_balance numeric(38,2) DEFAULT 0.00,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: daily_sales; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.daily_sales (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sales_date date NOT NULL,
    total_sales_value numeric(12,2) NOT NULL,
    cash_handed_over numeric(12,2) NOT NULL,
    discrepancy numeric(10,2) DEFAULT 0.00,
    operator_id uuid NOT NULL,
    received_by character varying(100),
    remarks character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: item_product; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.item_product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(50) NOT NULL,
    reorder_level integer DEFAULT 10 NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: purchase_invoice; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.purchase_invoice (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    supplier_id uuid NOT NULL,
    invoice_number character varying(50),
    total_amount numeric(12,2) NOT NULL,
    invoice_date date DEFAULT CURRENT_DATE NOT NULL,
    remarks character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: purchase_invoice_item; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.purchase_invoice_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    purchase_invoice_id uuid NOT NULL,
    item_id uuid NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    line_total numeric(12,2) NOT NULL
);


--
-- Name: stock_adjustment_log; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.stock_adjustment_log (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    item_id uuid NOT NULL,
    adjustment_type character varying(50) NOT NULL,
    previous_qty integer NOT NULL,
    quantity_changed integer NOT NULL,
    new_qty integer NOT NULL,
    unit_price numeric(10,2) DEFAULT 0.00 NOT NULL,
    total_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    reason character varying(100),
    remarks character varying(255),
    adjustment_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: stock_ledger; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.stock_ledger (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    item_id uuid NOT NULL,
    current_qty integer DEFAULT 0 NOT NULL,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: supplier; Type: TABLE; Schema: schema_milk_shop; Owner: -
--

CREATE TABLE schema_milk_shop.supplier (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    contact_number character varying(20),
    address character varying(255),
    is_active boolean DEFAULT true
);


--
-- Name: daily_remittance; Type: TABLE; Schema: schema_room_section; Owner: -
--

CREATE TABLE schema_room_section.daily_remittance (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    remittance_date date NOT NULL,
    total_collected numeric(12,2) NOT NULL,
    receptionist_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: guest_booking; Type: TABLE; Schema: schema_room_section; Owner: -
--

CREATE TABLE schema_room_section.guest_booking (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    room_id uuid NOT NULL,
    guest_name character varying(100) NOT NULL,
    nic_passport character varying(50) NOT NULL,
    adults integer DEFAULT 1,
    children integer DEFAULT 0,
    check_in timestamp without time zone NOT NULL,
    check_out timestamp without time zone,
    no_of_days integer DEFAULT 1,
    extra_hours integer DEFAULT 0,
    extra_hour_charge numeric(12,2) DEFAULT 0.00,
    service_charge_amount numeric(12,2) DEFAULT 0.00,
    advance_payment numeric(10,2) DEFAULT 0.00,
    final_payment_amount numeric(12,2) DEFAULT 0.00,
    final_payment_date timestamp without time zone,
    payment_status character varying(20) DEFAULT 'PARTIAL'::character varying,
    sub_total numeric(12,2) NOT NULL,
    vat_rate numeric(5,2) DEFAULT 18.00,
    sscl_rate numeric(5,2) DEFAULT 2.50,
    tax_amount numeric(10,2) NOT NULL,
    total_due numeric(12,2) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL
);


--
-- Name: room; Type: TABLE; Schema: schema_room_section; Owner: -
--

CREATE TABLE schema_room_section.room (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    room_number character varying(10) NOT NULL,
    room_type character varying(20) NOT NULL,
    base_price numeric(10,2) NOT NULL,
    extra_hour_rate numeric(10,2) DEFAULT 0.00,
    status character varying(20) DEFAULT 'AVAILABLE'::character varying NOT NULL
);


--
-- Name: room_billing_setting; Type: TABLE; Schema: schema_room_section; Owner: -
--

CREATE TABLE schema_room_section.room_billing_setting (
    id integer NOT NULL,
    vat_rate numeric(5,2) DEFAULT 18.00 NOT NULL,
    sscl_rate numeric(5,2) DEFAULT 2.50 NOT NULL
);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: schema_admin; Owner: -
--

ALTER TABLE ONLY schema_admin.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: audit_observation audit_observation_pkey; Type: CONSTRAINT; Schema: schema_admin; Owner: -
--

ALTER TABLE ONLY schema_admin.audit_observation
    ADD CONSTRAINT audit_observation_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: schema_admin; Owner: -
--

ALTER TABLE ONLY schema_admin.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: schema_admin; Owner: -
--

ALTER TABLE ONLY schema_admin.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: utility_bill utility_bill_pkey; Type: CONSTRAINT; Schema: schema_admin; Owner: -
--

ALTER TABLE ONLY schema_admin.utility_bill
    ADD CONSTRAINT utility_bill_pkey PRIMARY KEY (id);


--
-- Name: beer_garden_grn beer_garden_grn_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.beer_garden_grn
    ADD CONSTRAINT beer_garden_grn_pkey PRIMARY KEY (id);


--
-- Name: beer_items beer_items_item_code_key; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.beer_items
    ADD CONSTRAINT beer_items_item_code_key UNIQUE (item_code);


--
-- Name: beer_items beer_items_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.beer_items
    ADD CONSTRAINT beer_items_pkey PRIMARY KEY (id);


--
-- Name: beer_price_list beer_price_list_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.beer_price_list
    ADD CONSTRAINT beer_price_list_pkey PRIMARY KEY (id);


--
-- Name: grn_item grn_item_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.grn_item
    ADD CONSTRAINT grn_item_pkey PRIMARY KEY (id);


--
-- Name: issuance_invoice issuance_invoice_invoice_number_key; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.issuance_invoice
    ADD CONSTRAINT issuance_invoice_invoice_number_key UNIQUE (invoice_number);


--
-- Name: issuance_invoice issuance_invoice_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.issuance_invoice
    ADD CONSTRAINT issuance_invoice_pkey PRIMARY KEY (id);


--
-- Name: issuance_item issuance_item_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.issuance_item
    ADD CONSTRAINT issuance_item_pkey PRIMARY KEY (id);


--
-- Name: payment_record payment_record_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.payment_record
    ADD CONSTRAINT payment_record_pkey PRIMARY KEY (id);


--
-- Name: supplier_payments supplier_payments_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.supplier_payments
    ADD CONSTRAINT supplier_payments_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: daily_sales daily_sales_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.daily_sales
    ADD CONSTRAINT daily_sales_pkey PRIMARY KEY (id);


--
-- Name: daily_sales daily_sales_sales_date_key; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.daily_sales
    ADD CONSTRAINT daily_sales_sales_date_key UNIQUE (sales_date);


--
-- Name: item_product item_product_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.item_product
    ADD CONSTRAINT item_product_pkey PRIMARY KEY (id);


--
-- Name: purchase_invoice_item purchase_invoice_item_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.purchase_invoice_item
    ADD CONSTRAINT purchase_invoice_item_pkey PRIMARY KEY (id);


--
-- Name: purchase_invoice purchase_invoice_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.purchase_invoice
    ADD CONSTRAINT purchase_invoice_pkey PRIMARY KEY (id);


--
-- Name: stock_adjustment_log stock_adjustment_log_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.stock_adjustment_log
    ADD CONSTRAINT stock_adjustment_log_pkey PRIMARY KEY (id);


--
-- Name: stock_ledger stock_ledger_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.stock_ledger
    ADD CONSTRAINT stock_ledger_pkey PRIMARY KEY (id);


--
-- Name: supplier supplier_pkey; Type: CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.supplier
    ADD CONSTRAINT supplier_pkey PRIMARY KEY (id);


--
-- Name: daily_remittance daily_remittance_pkey; Type: CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.daily_remittance
    ADD CONSTRAINT daily_remittance_pkey PRIMARY KEY (id);


--
-- Name: daily_remittance daily_remittance_remittance_date_key; Type: CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.daily_remittance
    ADD CONSTRAINT daily_remittance_remittance_date_key UNIQUE (remittance_date);


--
-- Name: guest_booking guest_booking_pkey; Type: CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.guest_booking
    ADD CONSTRAINT guest_booking_pkey PRIMARY KEY (id);


--
-- Name: room_billing_setting room_billing_setting_pkey; Type: CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.room_billing_setting
    ADD CONSTRAINT room_billing_setting_pkey PRIMARY KEY (id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: room room_room_number_key; Type: CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.room
    ADD CONSTRAINT room_room_number_key UNIQUE (room_number);


--
-- Name: idx_audit_obs_auditor; Type: INDEX; Schema: schema_admin; Owner: -
--

CREATE INDEX idx_audit_obs_auditor ON schema_admin.audit_observation USING btree (auditor_id);


--
-- Name: idx_audit_obs_module; Type: INDEX; Schema: schema_admin; Owner: -
--

CREATE INDEX idx_audit_obs_module ON schema_admin.audit_observation USING btree (module);


--
-- Name: idx_audit_obs_status; Type: INDEX; Schema: schema_admin; Owner: -
--

CREATE INDEX idx_audit_obs_status ON schema_admin.audit_observation USING btree (status);


--
-- Name: idx_beer_invoice_status; Type: INDEX; Schema: schema_beer_garden; Owner: -
--

CREATE INDEX idx_beer_invoice_status ON schema_beer_garden.issuance_invoice USING btree (status);


--
-- Name: idx_milk_sales_date; Type: INDEX; Schema: schema_milk_shop; Owner: -
--

CREATE INDEX idx_milk_sales_date ON schema_milk_shop.daily_sales USING btree (sales_date);


--
-- Name: idx_room_booking_dates; Type: INDEX; Schema: schema_room_section; Owner: -
--

CREATE INDEX idx_room_booking_dates ON schema_room_section.guest_booking USING btree (check_in, check_out);


--
-- Name: beer_price_list beer_price_list_beer_item_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.beer_price_list
    ADD CONSTRAINT beer_price_list_beer_item_id_fkey FOREIGN KEY (beer_item_id) REFERENCES schema_beer_garden.beer_items(id) ON DELETE CASCADE;


--
-- Name: grn_item grn_item_beer_item_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.grn_item
    ADD CONSTRAINT grn_item_beer_item_id_fkey FOREIGN KEY (beer_item_id) REFERENCES schema_beer_garden.beer_items(id);


--
-- Name: grn_item grn_item_grn_invoice_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.grn_item
    ADD CONSTRAINT grn_item_grn_invoice_id_fkey FOREIGN KEY (grn_invoice_id) REFERENCES schema_beer_garden.beer_garden_grn(id) ON DELETE CASCADE;


--
-- Name: issuance_item issuance_item_beer_item_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.issuance_item
    ADD CONSTRAINT issuance_item_beer_item_id_fkey FOREIGN KEY (beer_item_id) REFERENCES schema_beer_garden.beer_items(id);


--
-- Name: issuance_item issuance_item_invoice_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.issuance_item
    ADD CONSTRAINT issuance_item_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES schema_beer_garden.issuance_invoice(id) ON DELETE CASCADE;


--
-- Name: payment_record payment_record_invoice_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.payment_record
    ADD CONSTRAINT payment_record_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES schema_beer_garden.issuance_invoice(id);


--
-- Name: supplier_payments supplier_payments_grn_invoice_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.supplier_payments
    ADD CONSTRAINT supplier_payments_grn_invoice_id_fkey FOREIGN KEY (grn_invoice_id) REFERENCES schema_beer_garden.beer_garden_grn(id);


--
-- Name: supplier_payments supplier_payments_supplier_id_fkey; Type: FK CONSTRAINT; Schema: schema_beer_garden; Owner: -
--

ALTER TABLE ONLY schema_beer_garden.supplier_payments
    ADD CONSTRAINT supplier_payments_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES schema_beer_garden.suppliers(id);


--
-- Name: purchase_invoice_item purchase_invoice_item_item_id_fkey; Type: FK CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.purchase_invoice_item
    ADD CONSTRAINT purchase_invoice_item_item_id_fkey FOREIGN KEY (item_id) REFERENCES schema_milk_shop.item_product(id);


--
-- Name: purchase_invoice_item purchase_invoice_item_purchase_invoice_id_fkey; Type: FK CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.purchase_invoice_item
    ADD CONSTRAINT purchase_invoice_item_purchase_invoice_id_fkey FOREIGN KEY (purchase_invoice_id) REFERENCES schema_milk_shop.purchase_invoice(id) ON DELETE CASCADE;


--
-- Name: purchase_invoice purchase_invoice_supplier_id_fkey; Type: FK CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.purchase_invoice
    ADD CONSTRAINT purchase_invoice_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES schema_milk_shop.supplier(id);


--
-- Name: stock_adjustment_log stock_adjustment_log_item_id_fkey; Type: FK CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.stock_adjustment_log
    ADD CONSTRAINT stock_adjustment_log_item_id_fkey FOREIGN KEY (item_id) REFERENCES schema_milk_shop.item_product(id);


--
-- Name: stock_ledger stock_ledger_item_id_fkey; Type: FK CONSTRAINT; Schema: schema_milk_shop; Owner: -
--

ALTER TABLE ONLY schema_milk_shop.stock_ledger
    ADD CONSTRAINT stock_ledger_item_id_fkey FOREIGN KEY (item_id) REFERENCES schema_milk_shop.item_product(id);


--
-- Name: guest_booking guest_booking_room_id_fkey; Type: FK CONSTRAINT; Schema: schema_room_section; Owner: -
--

ALTER TABLE ONLY schema_room_section.guest_booking
    ADD CONSTRAINT guest_booking_room_id_fkey FOREIGN KEY (room_id) REFERENCES schema_room_section.room(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 1zufjkkp5uvRkUSM3DCed0pEmbIMvKadTlWeIsmDt5ZjkB9NZup5r40ZZksU52q


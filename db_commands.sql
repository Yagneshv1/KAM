-- Custom enumerated data types
CREATE TYPE leadStatus AS ENUM ('New', 'Contacted', 'Converted', 'Lost', 'Inactive');
CREATE TYPE callFrequency AS ENUM('Daily', 'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly', 'Quarterly', 'Yearly')
CREATE TYPE gender as ENUM('Male', 'Female', 'Other')

-- Table to store the information of the leads
CREATE TABLE leads(
    lead_id serial primary key,
    lead_name varchar(100) not null,
    lead_status leadStatus not null,
    lead_address text not null,
    lead_city varchar(50) not null,
    lead_state varchar(50) not null,
    lead_pincode int not null,
    email varchar(75) not null,
    mobile bigint not null,
    website text,
    lead_domain varchar,
    call_frequency callFrequency not null,
    last_call timestamptz
)

-- Table to store the POC infornmation 
CREATE TABLE Pocs(
    poc_id serial PRIMARY KEY,
    lead_id int not null,
    poc_name varchar(100) not null,
    poc_age int check (poc_age >= 0 and poc_age <= 100) not null,
    poc_gender gender not null,
    poc_mobile BIGINT,
    poc_email text,
    poc_from date not null,
    poc_to date,
    poc_role varchar(50) not null,
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id) 
)

-- Table to store the details of the interactions by KAMs
CREATE TABLE INTERACTIONS(
    lead_id int not null,
    interaction_time timestamptz not null,
    interaction_mode varchar(50) not null,
    interaction_details text,
    CONSTRAINT interaction_pk PRIMARY KEY(interaction_time, lead_id),
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id) 
)

-- Relation table to map the interaction and POCs
CREATE TABLE INTERACTS(
    poc_id int not null,
    interaction_time timestamptz not null,
    lead_id int not null,
    CONSTRAINT poc_interaction_pk PRIMARY KEY(interaction_time, lead_id, poc_id),
    CONSTRAINT fk_poc FOREIGN KEY(poc_id) REFERENCES Pocs(poc_id),
    CONSTRAINT fk_interaction FOREIGN KEY(interaction_time, lead_id) REFERENCES INTERACTIONS(interaction_time, lead_id)
)

-- Table to store the details of the orders placed
CREATE TABLE ORDERS(
    order_id serial PRIMARY KEY,
    poc_id int,
    interaction_time timestamptz,
    lead_id int not null,
    order_time timestamptz not null,
    order_details text not null,
    order_value numeric not null check(order_value >= 0),
    CONSTRAINT fk_poc FOREIGN KEY(poc_id) REFERENCES Pocs(poc_id),
    CONSTRAINT fk_interaction FOREIGN KEY(interaction_time, lead_id) REFERENCES INTERACTIONS(interaction_time, lead_id)
)

-- Table to store the performance of the leads over months
CREATE TABLE PERFORMANCE_METRICS(
    lead_id int not null,
    measured_time timestamptz not null,
    avg_order_value numeric not null check(avg_order_value >= 0),
    order_count int not null check(order_count > 0),
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id),
    CONSTRAINT performance_pk PRIMARY KEY(lead_id, measured_time)
)

-- Table to store the basic information of the KAMs
CREATE TABLE USERS(
    kam_id serial primary key,
    username varchar(100) not null,
    user_password text not null,
    kam_name varchar(100) not null,
    kam_role text not null,
    date_of_birth date not null,
    mobile_no bigint not null,
    email varchar(75) not null
)

-- Updates the performance of the lead when a new order is placed.
CREATE OR REPLACE PROCEDURE upsert_performance_metrics(
    new_lead_id INT,
    new_order_value DECIMAL,
    new_measured_time TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE performance_metrics
    SET
    -- If an order already exists in current month, update the metrics
        avg_order_value = (avg_order_value * order_count + new_order_value) / (order_count + 1),
        order_count = order_count + 1
    WHERE lead_id = new_lead_id
      AND DATE_TRUNC('month', new_measured_time) = DATE_TRUNC('month', measured_time);

    -- For a lead placing order for first time, add a performance metric for the current month
    IF NOT FOUND THEN
        INSERT INTO performance_metrics (lead_id, measured_time, avg_order_value, order_count)
        VALUES (
            new_lead_id,
            new_measured_time,
            new_order_value,
            1
        );
    END IF;
END;
$$;

-- Trigger to automatically update the performance of the lead
CREATE OR REPLACE FUNCTION trigger_upsert_performance_metrics() 
RETURNS TRIGGER AS $$
BEGIN
    CALL upsert_performance_metrics(
        NEW.lead_id,
        NEW.order_value,
        NEW.order_time
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger an event when new order is placed by the lead
CREATE TRIGGER after_order_insert_or_update
AFTER INSERT OR UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION trigger_upsert_performance_metrics();

-- Fetch the information about the performance trends of the leads over months
CREATE OR REPLACE FUNCTION get_accounts_performance()
RETURNS TABLE (
    lead varchar(100),
    order_value NUMERIC,
    count INT,
    performance_month timestamptz,
    performance BOOLEAN
) AS
$$
BEGIN
RETURN QUERY
WITH month_comparison AS (
    SELECT
        lead_id,
        lead_name,
        avg_order_value,
        order_count,
        DATE_TRUNC('month', measured_time) AS current_month, -- Compare data with previous month data
        LAG(avg_order_value) OVER (PARTITION BY lead_id ORDER BY DATE_TRUNC('month', measured_time)) AS prev_avg_order_value
    FROM performance_metrics natural join leads
)
SELECT
    lead_name,
    avg_order_value,
    order_count,
    current_month AS measured_month,
    CASE 
        WHEN prev_avg_order_value IS NULL THEN TRUE
        WHEN avg_order_value < prev_avg_order_value * 0.8 THEN FALSE -- If the average order value falls below 80% of the previous data, consider underperformance
        ELSE TRUE
    END AS performance
FROM month_comparison
ORDER BY lead_id, current_month DESC;  -- Sort the results by lead id and from latest month
END;
$$ LANGUAGE plpgsql;


-- Gets the details of the interactions in the system
CREATE OR REPLACE FUNCTION get_interactions()
RETURNS TABLE (
    leadName varchar(100),
    interactionTime timestamptz,
    interactionMode varchar(50),
    interactionDetails text,
    pocName varchar(100),
    orderTime timestamptz,
    orderValue numeric,
    orderDetails text,
    orderId int
) AS
$$
BEGIN
    RETURN QUERY
        SELECT p.lead_name, p.interaction_time, p.interaction_mode, p.interaction_details, p.poc_name, order_time, order_value, order_details, order_id
        FROM (SELECT lead_name, interaction_time, interaction_mode, interaction_details, poc_name, lead_id, poc_id from 
            interactions natural join interacts natural join pocs natural join leads) as p 
        left join orders on p.lead_id = orders.lead_id and p.interaction_time = orders.interaction_time and p.poc_id = orders.poc_id;
END;
$$ LANGUAGE plpgsql;


-- Function to get the details of the leads who needs to be contacted at the time now.
CREATE OR REPLACE FUNCTION get_todays_calls()
RETURNS TABLE (
    leadName varchar(100),
    leadEmail varchar(75),
    leadMobile bigint,
    pocName varchar(100),
    pocEmail text,
    pocMobile bigint
) AS
$$
BEGIN
    RETURN QUERY
        SELECT lead_name, email, mobile, poc_name, poc_email, poc_mobile FROM leads left join pocs 
        ON leads.lead_id = pocs.lead_id
        WHERE 
        lead_status != 'Lost' AND
        (last_call is null OR
        (CASE
            WHEN call_frequency = 'Daily' THEN last_call + INTERVAL '1 day'
            WHEN call_frequency = 'Weekly' THEN last_call + INTERVAL '1 week'
            WHEN call_frequency = 'Bi-Weekly' THEN last_call + INTERVAL '2 weeks'
            WHEN call_frequency = 'Semi-Monthly' THEN 
                CASE
                    WHEN EXTRACT(DAY FROM last_call) <= 15
                    THEN last_call + INTERVAL '15 days'
                    ELSE last_call + INTERVAL '1 month'
                END
            WHEN call_frequency = 'Monthly' THEN last_call + INTERVAL '1 month'
            WHEN call_frequency = 'Quarterly' THEN last_call + INTERVAL '3 months'
            WHEN call_frequency = 'Yearly' THEN last_call + INTERVAL '1 year' -- Compute the next call time based on the previous call time and frequency
        END <= NOW()));
END;
$$ LANGUAGE plpgsql;


-- Records a new interaction into the system
CREATE OR REPLACE PROCEDURE add_interaction(
    p_lead_id INT,
    p_interaction_time TIMESTAMP,
    p_interaction_mode varchar(50),
    p_interaction_details text,
    p_poc_id int,
    p_orders JSONB
)
LANGUAGE plpgsql AS
$$
DECLARE
    order_record JSONB;
    lead_current_status leadStatus;
BEGIN
    -- Insert interaction into the interactions table
    INSERT INTO interactions(lead_id, interaction_time, interaction_mode, interaction_details)
    VALUES (p_lead_id, p_interaction_time, p_interaction_mode, p_interaction_details);

    -- Insert interaction into the interacts table
    INSERT INTO interacts(poc_id, interaction_time, lead_id)
    VALUES (p_poc_id, p_interaction_time, p_lead_id);

    -- Iterate over the orders JSON array and insert each order
    FOR order_record IN 
        SELECT * FROM jsonb_array_elements(p_orders)
    LOOP
        INSERT INTO orders(poc_id, interaction_time, lead_id, order_time, order_details, order_value)
        VALUES (
            p_poc_id, 
            p_interaction_time, 
            p_lead_id, 
            p_interaction_time, 
            order_record->>'order_details',
            (order_record->>'order_value') :: numeric
        );
    END LOOP;

    -- Update the latest call time of the lead
    UPDATE leads
    SET last_call = GREATEST(last_call, p_interaction_time)
    WHERE lead_id = p_lead_id;

    SELECT lead_status INTO lead_current_status FROM leads WHERE lead_id = p_lead_id;

    -- Update the status of the leads based on the interaction made and previous state.
    IF lead_current_status = 'New' THEN
        UPDATE leads
        SET lead_status = 'Contacted'
        WHERE lead_id = p_lead_id;
    END IF;

    IF EXISTS (SELECT 1 FROM orders WHERE lead_id = p_lead_id) AND lead_current_status != 'Converted' THEN
        UPDATE leads
        SET lead_status = 'Converted'
        WHERE lead_id = p_lead_id;
    END IF;

    -- Update the leads(if any) which are Inactive or Lost even after interaction
    CALL update_lead_status_nightly();
END;
$$;


-- Function to update the status of leads every day to track inactive and lost leads
CREATE OR REPLACE PROCEDURE update_lead_status_nightly()
LANGUAGE plpgsql AS $$
BEGIN
    WITH latest_order AS (
        SELECT
            l.lead_id AS lead_id,
            MAX(o.order_time) AS last_order_date
        FROM
            leads l
        LEFT JOIN
            orders o ON l.lead_id = o.lead_id
        GROUP BY
            l.lead_id
    )
    
    UPDATE
        leads l
    SET
        lead_status = CASE
            WHEN lo.last_order_date IS NULL THEN 'Inactive'
            WHEN lo.last_order_date < NOW() - INTERVAL '3 months' THEN 'Lost'
            ELSE l.lead_status
        END
    FROM
        latest_order lo
    WHERE
        l.lead_id = lo.lead_id;
END;
$$;

-- Indices on the DB to optimise the queries
CREATE INDEX lead_id_index on leads using hash(lead_id);
CREATE INDEX interaction_lead_id_index on interactions using btree(lead_id, interaction_time);

CREATE INDEX performance_metrics_lead_id_measured_time_index ON performance_metrics(lead_id, measured_time);

CREATE INDEX idx_leads_call_frequency ON leads(call_frequency);

CREATE INDEX idx_leads_lead_status_last_call ON leads(lead_id, lead_status, last_call);

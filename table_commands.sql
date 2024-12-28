CREATE TYPE leadStatus AS ENUM ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Converted', 'Lost', 'Inactive');
CREATE TYPE callFrequency AS ENUM('Daily', 'Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly', 'Quarterly', 'Yearly')
CREATE TYPE gender as ENUM('Male', 'Female', 'Other')

CREATE TABLE leads(
    lead_id serial primary key,
    lead_name varchar(100) not null,
    lead_status leadStatus not null,
    lead_address text not null,
    lead_city varchar(50),
    lead_state varchar(50),
    lead_pincode int,
    email varchar(75),
    website text,
    lead_domain varchar,
    call_frequency callFrequency not null,
    last_call timestamptz
)

CREATE TABLE Pocs(
    poc_id serial PRIMARY KEY,
    lead_id int,
    poc_name varchar(100) not null,
    poc_age int check (poc_age >= 0 and poc_age <= 100),
    poc_gender gender not null,
    poc_mobile BIGINT,
    poc_email text,
    poc_from date not null,
    poc_to date,
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id) 
)
CREATE TABLE INTERACTIONS(
    lead_id int,
    interaction_time timestamptz not null,
    interaction_mode varchar(50) not null,
    interaction_details text,
    CONSTRAINT interaction_pk PRIMARY KEY(interaction_time, lead_id),
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id) 
)
CREATE TABLE INTERACTS(
    poc_id int,
    interaction_time timestamptz,
    lead_id int,
    CONSTRAINT poc_interaction_pk PRIMARY KEY(interaction_time, lead_id, poc_id),
    CONSTRAINT fk_poc FOREIGN KEY(poc_id) REFERENCES Pocs(poc_id),
    CONSTRAINT fk_interaction FOREIGN KEY(interaction_time, lead_id) REFERENCES INTERACTIONS(interaction_time, lead_id)
)
CREATE TABLE ORDERS(
    order_id serial PRIMARY KEY,
    lead_id int,
    poc_id int,
    interaction_time timestamptz,
    interaction_lead_id int,
    order_time timestamptz not null,
    order_details text not null,
    order_value bigint not null check(order_value >= 0),
    CONSTRAINT fk_poc FOREIGN KEY(poc_id) REFERENCES Pocs(poc_id),
    CONSTRAINT fk_interaction FOREIGN KEY(interaction_time, interaction_lead_id) REFERENCES INTERACTIONS(interaction_time, lead_id) ,
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id)
)
CREATE TABLE PERFORMANCE_METRICS(
    lead_id int,
    measured_time timestamptz not null,
    avg_order_value BIGINT not null check(avg_order_value >= 0),
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id),
    CONSTRAINT performance_pk PRIMARY KEY(lead_id, measured_time)
)
CREATE TABLE USERS(
    kam_id serial primary key,
    username varchar(100) not null,
    user_password text not null,
    kam_name varchar(100) not null,
    kam_role text not null,
    date_of_birth date not null,
    mobile_no bigint not null,
    email varchar(75) not null,
    joining_date date not null
)
CREATE TABLE Manages(
    kam_id int,
    lead_id int,
    CONSTRAINT manages_pk PRIMARY KEY(kam_id, lead_id),
    CONSTRAINT fk_lead FOREIGN KEY(lead_id) REFERENCES leads(lead_id),
    CONSTRAINT fk_kam FOREIGN KEY(kam_id) REFERENCES USERS(kam_id)
)

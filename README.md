# Key Account Manager(KAM) - Lead Management System

## Overview

**KAM Lead Management System** is an end-to-end developed web application with database system that helps the KAMs to manage the relationships with the restaurants(leads) as a part of their day-to-day business activities. It has complete imformation about the leads, interactions made with them, the orders placed and also critically to track the progress of the leads performance daily. It also provides a one place destination to keep notified about the leads to contact on a daily basis aiming towards maintaining symbiotic relationship with the restaurants.

## Objectives

- It provides an user-friendly interface for the KAMs to register themselves in the application. KAMs will be able to add new leads, interactions, POCs and also fetch the latest data of the orders placed. 

- It provides an upto date information about the call planning and the accounts performance.

- Utilize a PostgreSQL database interacted with the SQLAlchemy library to perform operations on the database to fetch the requested data.

- Uses a API oriented approach to perform various operations requested by the KAMs.

- Ensure faster response times, minimizing latency during the quey processing and the post-processing of the response data.

- Implement graceful error handling in case of any server crashes or there are unintended errors.

- More importantly, develop an underlying database schema which is easy to support additional features in the future and scalable without potential schema changes.


## Setting Up & Installation

### Running in Local

- Download the Repository and checkout into the the source folder.

- Run the frontend

        $ cd KAM/client

        $ npm install

        $ npm start

- Access the application at https://localhost:4200

- Run the backend

- First set up some environment variables as described below.

        $ cd KAM/api

        $ python3 -m venv venv

        $ source venv/bin/activate

        $ pip3 install -r requirements.txt

        $ export FLASK_APP=app.py

        $ flask run --host=0.0.0.0 --port=5000

### Running the deployed application

- The deployed UI can be accessed at [KAM Application](https://kam-app-git-master-yagneshs-projects-baecd0b4.vercel.app)

- The API documentation of the application can be accessed at [API Documentation](https://kam-hdee.onrender.com/apidocs/)

## Deployment Steps

Deployed Application Link - https://kam-app-git-master-yagneshs-projects-baecd0b4.vercel.app/login
### Frontend

- The front-end application has been deployed on the **Vercel** server.

- Click on 'Add New Project' and connect the Git account that has the source code.

- Choose and name for the project and select the root folder that contains the frontend code(client directory in the current app).

- Click on "Deploy" and the vercel automatically builds the application and returns the deployed production URL once it is live.

### Backend

- The back-end Python application is deployed using **Render** framework.

- Open the Render homepage and click on "Add new -> Web Service".

- Connect the Git account to Render and choose the respository that has the source code.

- Fill out the basic details like name of the deployment, how to install the requirements file and the command to build the source code.

        $ pip install -r requirements.txt

        $ python -m flask run --host=0.0.0.0

- Set up the environment variables

    - app_secret_key - Secret key for the app for hashing purposes

    - db_host - Host of the database

    - db_name - Name of the database

    - db_password - Password of the database user

    - db_port - Port to connect to the database

    - db_username - Username to connect to the database

- Click on "Deploy Web Service" and the Render automatically builds the application and returns the deployed production URL of the backend server once it is live.

P.S: Because of the usage of free instances of the backend rendering, the API requests are delayed by 50seconds when the server is kept inactive added from the deployment end by Render which is not the case in local running.


## Running Unit Tests

To run the unit tests of the UI, run the following commands:

    $ cd KAM/client

    $ ng test

It will open up a window in the browser that shows the results of each unit test.

To run the tests along with the code coverage run the following command instead.

    $ ng test --code-coverage


## Usage Guidelines

- Open the UI interface from the [deployment link](https://kam-app-git-master-yagneshs-projects-baecd0b4.vercel.app).

- When a KAM opens the application for the first time, one needs to signup first to be able to access the application. Once the signup is complete, login into the application with the username and password provided during registration.

- Once the KAM logs in, one would be able to see the following sections in the application.

    - Lead Manager - Displays the information of the leads.

    - Interaction Manager - Displays all the interactions made by the KAMs

    - Call Planner - Displays the details of the leads that has to be contacted as per the local time of the KAM.

    - Performance Manager - Displays the underperforming and the good performance leads over the months.

- When we click on a specific lead record name, the application is redirected to summary page which displays the details of the POC of the corresponding lead.

- KAMs can also add new leads, POCs,and interactions from the respective sections.

- In case of any discrepancies, the KAMs can also update the data of the leads and the POCs using the edit button provided in the respective rows.

- The session of the user expires after a duration of 30minutes from the login and a dialog would appear requesting the KAM to relogin into the application.

## Design

The basic design of the KAM system involves a friendly interface for the KAM interaction implemented in **Angular** and the backend server developed in **Python with Flask** framework with support of **APIs** for all operations. Under the hood, the backend application interacts with **PostgreSQL database** and returns the requested data. The results obtained are further processed and sent back to the client side model for rendering in a representative way.

The Entity-Relationship diagram(ER diagram) used to model the KAM system is as follows:

[ER diagram](https://drive.google.com/file/d/1-Kv6xZoK8mR8FELN8v_xGPwRV_6qYUT_/view)

### Salient features of the designed system

- Every Poc is always associated with a lead and a lead can have multiple Pocs with different roles.

- Each interaction requires a poc always and can have multiple Pocs especially when Email is used as communication medium.

- Every order placed in the system has to be facilitated by a Poc and should have an associated interaction.

- Each order should be associated with a lead(restaurant) and group ordering by the leads is not permitted.

- Every lead has performance metrics for each month in which orders are placed to keep track of the trends and the performance over time.


### Design Decisions

- **Different timezones** - To handle the time differences in the locations of the leads and the KAMs, all time related data have been stored in the UTC format which is the default way how the PostgreSQL tables store the date type objects and any comparisons performed on the client side or the backend side are done after conversion into the local time zones.

- **Changes in the KAM** - The underlying database of the KAM has been designed to permit potential changes in the KAM application that could be introduced to prevent redrawing of th schema by keeping the constraints loose on the tables without the loss of consistency and correctness.

- **Handling More Users** - In order to handle heavy incoming traffic from the users, certain simple optimisation methods like indexing the commonly used columns like lead_status, last_call time have been indexed to provide quick responses reducing the load on the server. Also, **Rate Limiting** has been defined on all the routes with IP address as the identifier reducing excessive usage by each user or malicious actors which could potentially stall the system.

- **SQL Vs NoSQL** - In this application, the way data is typically present has a proper structure for each of the data and using a SQL model typically helps to properly manage the relationships between the entities. Also, complex computation operations are better performed with optimisations in the SQL database. Hence, I chose **PostgreSQL** model for this system.

## Sample App Usage

[Sample app usage](https://docs.google.com/document/d/1LOYAbFvo-5TI3uhoyiolYDaU770lKyCyikMaDHK4NSk/edit?tab=t.0)

## Roadmap


- Improve the UX supporting more efficient representation of accounts performance with graphs which can display the trends more accurately.

- Add the option to edit the interaction records in the system.

- Automate the process of adding interactions when an email is sent. Also, we could integrate the mail sending option directly from the application.

- Developing an user interface for supporting chat messages with the leads and POCs and an automated summary generator to record the interaction details automatically.

- Implement the option to login directly using the google client bypassing the separate login each time.

- Breakdown the application into independent microservices for different functionalities which could allow scaling of individual service based on the demand.

- Implement the caching mechanism for frequent queries which could improve the system performance. 

- Implement a mechanism to notify the leads about upcoming calls, missed interactions.

- Develop the mechanism to develop collaboration among the KAMs in case of shared leads managing. Also, assignment of leads could be done to each KAM based on properties like the timezone for better communication.

- Improve the ability to handle concurrent queries with load balancer.

## Authors

(02/01/2025) Yagnesh Katragadda, Associate Software Engineer II 


import sqlalchemy, json
from flask import request, jsonify
from sqlalchemy.sql import text
import datetime
from sqlalchemy.exc import SQLAlchemyError
from datetime import date
from flask_jwt_extended import create_access_token, jwt_required
from . import app, bcrypt
from .utils import handle_errors
from .database import PostgresqlDB
from .utils import convertDateStringToParts, convertJSONAggToList

@app.route("/", methods=['GET'])
def home():
    return jsonify({'data': 'Hello world'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    login_credentials = request.get_json()
    try:
        db_instance = PostgresqlDB()

        statement = text("SELECT * FROM users WHERE username=:username")
        result = db_instance.execute_dql_commands(statement, {
            'username': login_credentials.get('username')
        })

        user = result.fetchone()
        if user:
            if bcrypt.check_password_hash(user[2], login_credentials.get('password')):
                access_token = create_access_token(identity=login_credentials.get('username'), expires_delta=datetime.timedelta(minutes=30))
                return jsonify({"message": "Logged in successfully!", "access_token": access_token}), 200
            else:
                return jsonify({"message": "Incorrect password"}), 401
        else:
            return jsonify({"message": "No user found! Please signup first."}), 401
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)


@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        user_details = request.get_json()

        db_instance = PostgresqlDB()
        
        query = text("SELECT * FROM users WHERE username=:username")
        existing_user = db_instance.execute_dql_commands(query, {'username': user_details.get('username')})
        
        if existing_user.fetchone():
            return jsonify({"message": "Username already exists. Continue login or choose a different username."}), 409
        
        dob_values = convertDateStringToParts(user_details.get('dob'))
        parameters = {
            'username': user_details.get('username'),
            'password': bcrypt.generate_password_hash(user_details.get('password')).decode('utf-8'),
            'name': user_details.get('name'),
            'role': user_details.get('role'),
            'dob': date(dob_values[0], dob_values[1], dob_values[2]),
            'mobile': user_details.get('mobile'),
            'email': user_details.get('email')
        }

        insert_query = text("""INSERT INTO users(username, user_password, kam_name, kam_role, date_of_birth, mobile_no, email) 
                            VALUES (:username, :password, :name, :role, :dob, :mobile, :email)""")
        
        db_instance.execute_ddl_and_dml_commands(insert_query, parameters)
        return jsonify({"message": "User registered successfully!"}), 201
    
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
       handle_errors(e)

@app.route('/api/leads', methods=['GET', 'POST'])
@jwt_required()
def get_leads():
    try:
        db_instance = PostgresqlDB()
        if request.method == 'GET':
            compact = request.args.get('compact')
            query = None

            if compact:
                query = text('''with leads_info as (
                            select lead_id, lead_name, poc_name, poc_id from leads natural join pocs)
                            select json_agg(leads_info) from leads_info''')
            else:
                query = text("SELECT json_agg(leads) from leads")

            leads = db_instance.execute_dql_commands(query).fetchone()
            return jsonify({"data": convertJSONAggToList(leads), "message": "Leads records fetched successfully!"}), 200
        else:
            leadData = request.get_json()
            leadData['status'] = 'New'
            query = text('''insert into leads(lead_name, lead_status, lead_address, lead_city, lead_state, lead_pincode, 
                        email, mobile, website, lead_domain, call_frequency, last_call) 
                        values(:name, :status, :address, :city, :state, :pincode, :email, :mobile, :website, :domain, :call_frequency, null)''')

            db_instance.execute_ddl_and_dml_commands(query, leadData)
            return jsonify({"message": "Lead added successfully!"}), 201
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)

@app.route('/api/leads', methods=['PUT'])
@jwt_required()
def update_leads():
    try:
        db_instance = PostgresqlDB()
        leadData = request.get_json()
        query = text('''UPDATE leads set lead_name=:name, lead_address=:address, lead_city=:city, 
                        lead_state=:state, lead_pincode=:pincode, email=:email, mobile=:mobile, website=:website, 
                        lead_domain=:domain, call_frequency=:call_frequency WHERE lead_id=:lead_id''')

        db_instance.execute_ddl_and_dml_commands(query, leadData)
        return jsonify({"message": "Lead updated successfully!"}), 204
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)
    
@app.route('/api/lead/<int:id>/poc-info', methods=['GET', 'POST'])
@jwt_required()
def get_lead_poc(id):
    try:
        db_instance = PostgresqlDB()
        if request.method == 'GET':
            query = text("SELECT json_agg(Pocs) from Pocs WHERE lead_id=:id")
            leads = db_instance.execute_dql_commands(query, {'id': id}).fetchone()
            return jsonify({"data": convertJSONAggToList(leads), "message": "POCs retrieved successfully!"}), 200
        else:
            pocData = request.get_json()
            pocData['lead_id'] = int(id)
            pocData['from_date'] = date(*convertDateStringToParts(pocData['from_date']))
            pocData['to_date'] = date(*convertDateStringToParts(pocData['to_date'])) if pocData.get('to_date') else None

            query = text('''insert into Pocs(lead_id, poc_name, poc_age, poc_gender, poc_role, poc_mobile, poc_email, poc_from, poc_to)
                        values(:lead_id, :name, :age, :gender, :role, :mobile, :email, :from_date, :to_date)''')

            db_instance.execute_ddl_and_dml_commands(query, pocData)
            return jsonify({"message": "POC is added successfully!"}), 201
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)

@app.route('/api/lead/<int:id>/poc-info', methods=['PUT'])
@jwt_required()
def update_lead_poc(id):
    try:
        db_instance = PostgresqlDB()
        pocData = request.get_json()
        print(pocData)
        pocData['lead_id'] = int(id)
        pocData['from_date'] = date(*convertDateStringToParts(pocData['from_date']))
        pocData['to_date'] = date(*convertDateStringToParts(pocData['to_date'])) if pocData.get('to_date') else None

        query = text('''update Pocs set lead_id=:lead_id, poc_name=:name, poc_age=:age, poc_gender=:gender, poc_role=:role, 
                        poc_mobile=:mobile, poc_email=:email, poc_from=:from_date, poc_to=:to_date WHERE poc_id=:poc_id''')

        db_instance.execute_ddl_and_dml_commands(query, pocData)
        return jsonify({"message": "POC is updated successfully!"}), 204
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)

@app.route('/api/interactions', methods=['GET', 'POST'])
@jwt_required()
def get_interactions():
    try:
        db_instance = PostgresqlDB()
        if request.method == 'GET':
            query = text('''WITH interaction_info as (SELECT * from get_interactions())
                            SELECT json_agg(interaction_info.*) from interaction_info''')
            
            interactions = db_instance.execute_dql_commands(query).fetchone()
            return jsonify({"data": convertJSONAggToList(interactions), "message": "Interactions retrieved successfully!"}), 200
            
        else:
            interaction_data = request.get_json()
            for order in interaction_data["orders"]:
                order["order_value"] = float(order["order_value"])

            interaction_data["orders"] = json.dumps(interaction_data["orders"], default=str)
            interaction_data["lead_id"] = int(interaction_data["lead_id"])
            interaction_data["poc_id"] = int(interaction_data["poc_id"])

            db_instance.execute_ddl_and_dml_commands(
                text('''CALL add_interaction(:lead_id, :interaction_time, :interaction_mode, :interaction_details, :poc_id, :orders)'''),
                interaction_data
            )
            return jsonify({"message": "Interaction added successfully!"}), 201
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)


@app.route('/api/call-planner', methods=['GET'])
@jwt_required()
def get_call_planner():
    try:
        db_instance = PostgresqlDB()
        query = text('''WITH calls_info as
                        (SELECT * from get_todays_calls())
                        SELECT json_agg(calls_info.*) from calls_info''')

        calls = db_instance.execute_dql_commands(query).fetchone()
        return jsonify({"data": convertJSONAggToList(calls), "message": "Call Planner fetched successfully!"}), 200
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)
   

@app.route('/api/performance-metrics', methods=['GET'])
@jwt_required()
def get_performance_metrics():
    try:
        db_instance = PostgresqlDB()
        query = text('''WITH performance_info as
                        (SELECT * from get_accounts_performance())
                        SELECT json_agg(performance_info.*) from performance_info''')

        performance = db_instance.execute_dql_commands(query).fetchone()
        return jsonify({"data": convertJSONAggToList(performance), "message": "Performance metrics retrieved successfully!"}), 200
    except SQLAlchemyError as e:
        handle_errors(e, True)
    except Exception as e:
        handle_errors(e)
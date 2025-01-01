import sqlalchemy, json
from flask import Flask, request, jsonify
from sqlalchemy.sql import text
from sqlalchemy.engine import create_engine
sqlalchemy.__version__
import datetime
from flask_cors import CORS
from datetime import date
from flask_bcrypt import Bcrypt
from flasgger import Swagger
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import os
# Initialize Flask app
app = Flask(__name__)
CORS(app)
swagger_template_path = os.path.join(os.path.dirname(__file__), 'swagger_docs.yaml')

# Initialize Flasgger with the Swagger YAML documentation file
swagger = Swagger(app, template_file=swagger_template_path)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Set up secret key for session management (needed for flash messages)
app.secret_key = 'kam-app'

@app.route("/", methods=['GET'])
def home():
    return jsonify({'data': 'Hello world'})

@app.route('/api/login', methods=['POST'])
def login():
    login_credentials = request.get_json()
    
    db_instance = PostgresqlDB()

    statement = text("SELECT * FROM users WHERE username=:username")
    result = db_instance.execute_dql_commands(statement, {
        'username': login_credentials.get('username')
    })

    user = result.fetchone()
    if user:
        if bcrypt.check_password_hash(user[2], login_credentials.get('password')):
            access_token = create_access_token(identity=login_credentials.get('username'), expires_delta=datetime.timedelta(minutes=30))
            return jsonify({"message": "Logged in successfully!", "status": "success", "access_token": access_token}), 200
        else:
            return jsonify({"message": "Incorrect password", "status": "error"}), 401
    else:
        return jsonify({"message": "No user found! Please signup first.", "status": "error"}), 401

def convertDateStringToParts(dateString):
    return [int(i) for i in dateString.split('-')]

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        user_details = request.get_json()

        db_instance = PostgresqlDB()
        
        query = text("SELECT * FROM users WHERE username=:username")
        existing_user = db_instance.execute_dql_commands(query, {'username': user_details.get('username')})
        
        if existing_user.fetchone():
            return jsonify({"message": "User already exists. Continue login or choose a different username."}), 401
        
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
        return jsonify({"message": "User registered successfully!", "status": "success"}), 200
    
    except Exception as e:
        return jsonify({"message": "Error registering the user", "status": "error"}), 400

@app.route('/api/leads', methods=['GET', 'POST'])
@jwt_required()
def get_leads():
    db_instance = PostgresqlDB()
    if request.method == 'GET':
        compact = request.args.get('compact')
        query = None
        if compact:
            query = text('''with leads_info as (
                         select lead_name, lead_id, poc_name, poc_id from leads natural join pocs)
                         select json_agg(leads_info) from leads_info''')
        else:
            query = text("SELECT json_agg(leads) from leads")
        leads = db_instance.execute_dql_commands(query).fetchone()

        leads_data = []
        if not leads or not leads[0]:
            pass
        else:
            for row in leads[0]:
                leads_data.append(dict(row.items()))

        return jsonify({"data": leads_data, "status": "success"}), 200
    else:
        leadData = request.get_json()
        leadData['lead_status'] = 'New'
        query = text('''insert into leads(lead_name, lead_status, lead_address, lead_city, lead_state, lead_pincode, 
                     email, mobile, website, lead_domain, call_frequency, last_call) 
                     values(:name, :status, :address, :city, :state, :pincode, :email, :mobile, :website, :domain, :call_frequency, null)''')

        db_instance.execute_ddl_and_dml_commands(query, leadData)
        return jsonify({"message": "Lead added successfully!", "status": "success"}), 200
    
@app.route('/api/lead/<int:id>/poc-info', methods=['GET', 'POST'])
@jwt_required()
def get_lead_poc(id):
    db_instance = PostgresqlDB()
    if request.method == 'GET':
        query = text("SELECT json_agg(Pocs) from Pocs WHERE lead_id=:id")
        leads = db_instance.execute_dql_commands(query, {'id': id}).fetchone()

        leads_data = []
        if not leads or not leads[0]:
            pass
        else:
            for row in leads[0]:
                leads_data.append(dict(row.items()))

        return jsonify({"data": leads_data, "status": "success"}), 200
    else:
        pocData = request.get_json()
        pocData['lead_id'] = int(id)
        pocData['from_date'] = date(*convertDateStringToParts(pocData['from_date']))
        pocData['to_date'] = date(*convertDateStringToParts(pocData['to_date'])) if pocData.get('to_date') else None

        query = text('''insert into Pocs(lead_id, poc_name, poc_age, poc_gender, poc_role, poc_mobile, poc_email, poc_from, poc_to)
                     values(:lead_id, :name, :age, :gender, :role, :mobile, :email, :from_date, :to_date)''')

        db_instance.execute_ddl_and_dml_commands(query, pocData)
        return jsonify({"message": "POC is added successfully!", "status": "success"}), 200

@app.route('/api/interactions', methods=['GET', 'POST'])
@jwt_required()
def get_interactions():
    db_instance = PostgresqlDB()
    if request.method == 'GET':
        query = text('''WITH interaction_info as (
                    SELECT p.lead_name, p.interaction_time, p.interaction_mode, p.interaction_details, p.poc_name, order_time, order_value, order_details, order_id
                    FROM (select lead_name, interaction_time, interaction_mode, interaction_details, poc_name, lead_id, poc_id from 
                    interactions natural join interacts natural join pocs natural join leads) as p 
                    left join orders on p.lead_id = orders.lead_id and p.interaction_time = orders.interaction_time and p.poc_id = orders.poc_id)
                    SELECT json_agg(interaction_info.*) from interaction_info''')
        
        interactions = db_instance.execute_dql_commands(query).fetchone()

        interactions_data = []
        if not interactions or not interactions[0]:
            pass
        else:
            for row in interactions[0]:
                interactions_data.append(dict(row.items()))
        return jsonify({"data": interactions_data, "status": "success"}), 200
    else:
        interaction_data = request.get_json()
        for order in interaction_data["orders"]:
            order["order_value"] = float(order["order_value"])

        interaction_data["orders"] = json.dumps(interaction_data["orders"], default=str)
        interaction_data["lead_id"] = int(interaction_data["lead_id"])
        interaction_data["poc_id"] = int(interaction_data["poc_id"])

        db_instance.execute_ddl_and_dml_commands(
            text('''
                CALL add_interaction(
                    :lead_id,
                    :interaction_time,
                    :interaction_mode,
                    :interaction_details,
                    :poc_id,
                    :orders
                )
            '''),
            interaction_data
        )
        return jsonify({"message": "Interaction added successfully!", "status": "success"}), 200


@app.route('/api/call-planner', methods=['GET'])
@jwt_required()
def get_call_planner():
    db_instance = PostgresqlDB()
    query = text('''WITH calls_info as
                    (SELECT * from get_todays_calls())
                    SELECT json_agg(calls_info.*) from calls_info''')

    calls = db_instance.execute_dql_commands(query).fetchone()

    calls_now = []
    if not calls or not calls[0]:
        pass
    else:
        for row in calls[0]:
            calls_now.append(dict(row.items()))
    return jsonify({"data": calls_now, "status": "success"}), 200
   

@app.route('/api/performance-metrics', methods=['GET'])
@jwt_required()
def get_performance_metrics():
    db_instance = PostgresqlDB()
    query = text('''WITH performance_info as
                    (SELECT * from get_accounts_performance())
                    SELECT json_agg(performance_info.*) from performance_info''')

    performance = db_instance.execute_dql_commands(query).fetchone()

    performance_data = []
    if not performance or not performance[0]:
        pass
    else:
        for row in performance[0]:
            performance_data.append(dict(row.items()))
    return jsonify({"data": performance_data, "status": "success"}), 200

class PostgresqlDB:
    def __init__(self):
        self.username = 'postgres.kaupwhsakwbxrztaguya'
        self.password = 'HUDgxKWszahJn6V8'
        self.host = 'aws-0-ap-south-1.pooler.supabase.com'
        self.port = 6543
        self.db_name = 'postgres'
        self.engine = self.get_db_engine()

    def get_db_engine(self):
        try:
            db_uri = f'postgresql+psycopg2://{self.username}:{self.password}@{self.host}:{self.port}/{self.db_name}'
            return create_engine(db_uri)
        except Exception as e:
            print("Error connecting to the database")
            raise e
    
    def execute_dql_commands(self, statement, values = None):
        try:
            with self.engine.connect() as conn:
                if values is not None:
                    result = conn.execute(statement, values)
                else:
                    result = conn.execute(statement)
            return result
        except Exception as e:
            raise e
    
    def execute_ddl_and_dml_commands(self, statement, values):
        connection = self.engine.connect()
        trans = connection.begin()

        try:
            if values is not None:
                connection.execute(statement, values)
            else:
                connection.execute(statement)
            trans.commit()
            connection.close()        
        except Exception as e:
            connection.rollback()
            connection.close()


if __name__=='__main__':
    app.run(debug=True)
    
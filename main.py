import sqlalchemy
from flask import Flask, request, jsonify
from sqlalchemy.sql import text
from sqlalchemy.engine import create_engine
sqlalchemy.__version__
from flask_cors import CORS
from datetime import date
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

# Initialize Flask app
app = Flask(__name__)
CORS(app)
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
            access_token = create_access_token(identity=login_credentials.get('username'))
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
        doj_values = convertDateStringToParts(user_details.get('joining_date'))
        parameters = {
            'username': user_details.get('username'),
            'password': bcrypt.generate_password_hash(user_details.get('password')).decode('utf-8'),
            'name': user_details.get('name'),
            'role': user_details.get('role'),
            'dob': date(dob_values[0], dob_values[1], dob_values[2]),
            'mobile': user_details.get('mobile'),
            'email': user_details.get('email'),
            'joining_date': date(doj_values[0], doj_values[1], doj_values[2])
        }

        insert_query = text("""INSERT INTO users(username, user_password, kam_name, kam_role, date_of_birth, mobile_no, email, joining_date) 
                            VALUES (:username, :password, :name, :role, :dob, :mobile, :email, :joining_date)""")
        
        db_instance.execute_ddl_and_dml_commands(insert_query, parameters)
        return jsonify({"message": "User registered successfully!", "status": "success"}), 200
    
    except Exception as e:
        return jsonify({"message": "Error registering the user", "status": "error"}), 400

@app.route('/api/leads', methods=['GET', 'POST'])
@jwt_required()
def get_leads():
    db_instance = PostgresqlDB()
    if request.method == 'GET':
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
        query = text('''insert into leads(lead_name, lead_status, lead_address, lead_city, lead_state, lead_pincode, 
                     email, website, lead_domain, call_frequency, last_call) 
                     values(:name, :status, :address, :city, :state, :pincode, :email, :website, :domain, :call_frequency, null)''')

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
        pocData['to_date'] = date(*convertDateStringToParts(pocData['to_date']))

        query = text('''insert into Pocs(lead_id, poc_name, poc_age, poc_gender, poc_mobile, poc_email, poc_from, poc_to)
                     values(:lead_id, :name, :age, :gender, :mobile, :email, :from_date, :to_date)''')

        db_instance.execute_ddl_and_dml_commands(query, pocData)
        return jsonify({"message": "POC is added successfully!", "status": "success"}), 200

class PostgresqlDB:
    def __init__(self):
        self.username = 'postgres'
        self.password = 'XrhVUb2q$'
        self.host = 'udaan-kam.cxms2842cvb4.eu-north-1.rds.amazonaws.com'
        self.port = 5432
        self.db_name = 'udaan-kam'
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
    
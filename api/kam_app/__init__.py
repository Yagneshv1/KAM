from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flasgger import Swagger
import os

app = Flask(__name__)
CORS(app)
app.secret_key = os.environ['app_secret_key']

swagger_template_path = os.path.join(os.path.dirname(__file__), 'swagger_docs.yaml')
swagger = Swagger(app, template_file=swagger_template_path)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from .routes import *
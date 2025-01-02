from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flasgger import Swagger
import os
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
CORS(app)
app.secret_key = 'kam-app' #os.environ['app_secret_key']

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,  # Use IP address as identifier
    default_limits=["200 per day", "50 per hour"],  # Default limits for all routes
    storage_uri="memory://"
)

# Swagger configuration
swagger_template_path = os.path.join(os.path.dirname(__file__), 'swagger_docs.yaml')
swagger = Swagger(app, template_file=swagger_template_path)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

from .routes import *
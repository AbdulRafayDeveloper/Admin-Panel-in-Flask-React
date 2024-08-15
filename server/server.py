# server.py
from flask import Flask,send_from_directory
from flask_cors import CORS
from config.database import init_db
from routes.employeesRoutes import employeesAPI
from routes.cvDetectRoutes import cvAPI

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'public/assets/cv'  # Set the upload folder configuration
CORS(app, resources={r"/*": {"origins": "http://localhost:4000"}})

# Initialize the database
init_db(app)

# Register the blueprint -- APi Routes
app.register_blueprint(employeesAPI)
app.register_blueprint(cvAPI)

if __name__ == "__main__":
    app.run(debug=True, port=8000)
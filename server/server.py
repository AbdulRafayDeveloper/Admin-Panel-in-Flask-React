# server.py
from flask import Flask,send_from_directory
from flask_cors import CORS
from config.database import init_db
from routes.employeesRoutes import employeesAPI

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4000"}})

# Initialize the database
init_db(app)

# Register the blueprint -- APi Routes
app.register_blueprint(employeesAPI)

if __name__ == "__main__":
    app.run(debug=True, port=8000)
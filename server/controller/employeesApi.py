from flask import Blueprint, jsonify, request, g, current_app  # Added current_app
import MySQLdb
### for images and files ###
import os
from werkzeug.utils import secure_filename

employessAPI = Blueprint('api', __name__)

################ Start Api: /app/employees (POST)  ##################

# Set upload folder and allowed extensions
UPLOAD_FOLDER_IMAGES = 'public/assets/images'
UPLOAD_FOLDER_FILES = 'public/assets/files'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def employee_post_route_define():
    print("enter in api")
    data = request.form
    name = data.get('name')
    email = data.get('email')
    salary = data.get('salary')
    jobType = data.get('jobType')
    gender = data.get('gender')
    pic = request.files.get('pic')
    cv = request.files.get('cv')

    print(f"Debug: Name received from frontend: {name}")
    print(f"Debug: Email received from frontend: {email}")
    print(f"Debug: Salary received from frontend: {salary}")

    if not (name and email and salary and jobType and gender and pic and cv):
        return jsonify({'message': 'Please fill in all the fields.', 'status': 400})

    if not (allowed_file(pic.filename) and allowed_file(cv.filename)):
        return jsonify({'message': 'Invalid file format.', 'status': 400})

    try:
        cursor = g.db.cursor()

        # Check if the user already exists in the database
        cursor.execute("SELECT COUNT(*) as count FROM employees WHERE email = %s", (email,))
        checkUserExistence = cursor.fetchone()
        if checkUserExistence[0] > 0:
            return jsonify({'message': 'Your request has already been submitted to Admin', 'status': 400})

        # Insert a new employee
        cursor.execute("INSERT INTO employees (name, email, salary, jobType, gender) VALUES (%s, %s, %s, %s, %s)",
                       (name, email, salary, jobType, gender))
        g.db.commit()
        
        if cursor.rowcount <= 0:
            return jsonify({'message': 'Your request could not be submitted. Try again later!', 'status': 400})

        # Get the inserted user ID
        userId = cursor.lastrowid

        # Save files
        pic_filename = secure_filename(pic.filename)
        base_pic_name, pic_extension = os.path.splitext(pic_filename)
        pic_name = f"{base_pic_name}_{userId}{pic_extension}"
        pic.save(os.path.join(UPLOAD_FOLDER_IMAGES, pic_name))

        cv_filename = secure_filename(cv.filename)
        base_cv_name, cv_extension = os.path.splitext(cv_filename)
        cv_name = f"{base_cv_name}_{userId}{cv_extension}"
        cv.save(os.path.join(UPLOAD_FOLDER_FILES, cv_name))

        # Update the employee record with file names
        cursor.execute("UPDATE employees SET pic = %s, cv = %s WHERE id = %s", (pic_name, cv_name, userId))
        g.db.commit()

        return jsonify({'message': 'Your request has been submitted', 'status': 200})
    except MySQLdb.Error as e:
        print(f"Error: {e}")
        return jsonify({'message': 'An error occurred while adding the employee', 'status': 500})

################ Start Api: /app/employees (GET)  ##################
def employee_get_route_define():
    try:
        cursor = g.db.cursor(MySQLdb.cursors.DictCursor)  # Use DictCursor to fetch rows as dictionaries
        cursor.execute("SELECT * FROM employees")
        employees = cursor.fetchall()  # Fetch all results
        print(f"Employees: {employees}")
        return jsonify({'data': employees, 'message': 'Employees fetched successfully', 'status': 200})
    except MySQLdb.Error as e:
        print(f"Error: {e}")
        return jsonify({'message': 'An error occurred while fetching employees', 'status': 500})

################ Start Api: /app/employees/<id> (GET)  ##################
def employee_get_route_by_id_define(id):
    print("Enter in api To fetch Sepecific Record 1");
    try:
        print("Enter in api To fetch Sepecific Record 2");
        cursor = g.db.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute("SELECT * FROM employees WHERE id = %s", (id,))
        employee = cursor.fetchone()
        print("Enter in api To fetch Sepecific Record 3");

        if not employee:
            return jsonify({'message': 'Employee not found', 'status': 404})
            print("Enter in api To fetch Sepecific Record 4");
        return jsonify({'data': employee, 'message': 'Employee fetched successfully', 'status': 200})
    except MySQLdb.Error as e:
        print(f"Error: {e}")
        return jsonify({'message': 'An error occurred while fetching the employee', 'status': 500})

################ Start Api: /app/employees/<id> (PUT)  ##################
def employee_put_route_define(id):
    data = request.form  # Get form data
    name = data.get('name')
    email = data.get('email')

    print(f"Debug: Name received from frontend: {name}")
    print(f"Debug: Email received from frontend: {email}")

    if not name or not email:
        return jsonify({'message': 'Name and email are required', 'status': 400})

    try:
        cursor = g.db.cursor()

        cursor.execute("SELECT * FROM employees WHERE id = %s", (id,))
        employee = cursor.fetchone()

        if not employee:
            return jsonify({'message': 'Employee not found', 'status': 404})

        query = "UPDATE employees SET name = %s, email = %s WHERE id = %s"
        cursor.execute(query, (name, email, id))
        g.db.commit()

        return jsonify({'message': 'Employee updated successfully', 'status': 200})
    except MySQLdb.Error as e:
        print(f"Error: {e}")
        return jsonify({'message': 'An error occurred while updating the employee', 'status': 500})

################ Start Api: /app/employees/<id> (DELETE)  ##################
def employee_delete_route_define(id):
    try:
        cursor = g.db.cursor()
        print(f"Attempting to delete employee with id: {id}")

        cursor.execute("SELECT * FROM employees WHERE id = %s", (id,))
        employee = cursor.fetchone()

        if not employee:
            print(f"Employee with id {id} not found.")
            return jsonify({'message': 'Employee not found', 'status': 404})

        cursor.execute("DELETE FROM employees WHERE id = %s", (id,))
        g.db.commit()

        print(f"Employee with id {id} deleted successfully.")
        return jsonify({'message': 'Employee deleted successfully', 'status': 200})
    except MySQLdb.Error as e:
        print(f"Error deleting employee with id {id}: {e}")
        return jsonify({'message': 'An error occurred while deleting the employee', 'status': 500})
    finally:
        cursor.close()
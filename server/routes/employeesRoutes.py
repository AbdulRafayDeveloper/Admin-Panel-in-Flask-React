from flask import Blueprint,send_from_directory
from controller.employeesApi import employee_post_route_define,employee_get_route_define, employee_get_route_by_id_define,employee_put_route_define,employee_delete_route_define
employeesAPI = Blueprint('api', __name__)

@employeesAPI.route('/assets/files/download/<filename>')
def download_file(filename):
    return send_from_directory('assets/files', filename, as_attachment=True)

##### images ######
@employeesAPI.route('/assets/images/<path:filename>')
def custom_static_images(filename):
    return send_from_directory('public/assets/images', filename)

##### files ######
@employeesAPI.route('/assets/files/<path:filename>')
def custom_static_files(filename):
    return send_from_directory('public/assets/files', filename)

##### insert ######
@employeesAPI.route('/api/employees', methods=['POST'])
def employee_post_route_declare():
    return employee_post_route_define()

##### view ######
@employeesAPI.route('/api/employees', methods=['GET'])
def employee_get_route_declare():
    return employee_get_route_define()

# ##### get by id for update ######
@employeesAPI.route('/api/employees/<id>', methods=['GET'])
def employee_get_route_by_id_declare(id):
    return employee_get_route_by_id_define(id)

# ##### update ######
@employeesAPI.route('/api/employees/<id>', methods=['PUT'])
def employee_put_route_declare(id):
    return employee_put_route_define(id)

# ##### delete ######
@employeesAPI.route('/api/employees/<id>', methods=['DELETE'])
def employee_delete_route_declare(id):
    return employee_delete_route_define(id)
from flask import Blueprint, send_from_directory
from controller.cvDetectionApi import check_cv
cvAPI = Blueprint('cvAPI', __name__)

##### insert cv ######

@cvAPI.route('/api/cvDetection', methods=['POST'])
def cv_post_route_declare():
    return check_cv()

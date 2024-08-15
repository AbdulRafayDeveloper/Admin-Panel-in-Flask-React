from flask import Blueprint, jsonify, request, g, current_app  # Added current_app
import MySQLdb
### for images and files ###
import os
from werkzeug.utils import secure_filename
import spacy
import PyPDF2
from constants.computerSkills import expected_skills

cvAPI = Blueprint('api', __name__)

# Load spaCy model
nlp = spacy.load('en_core_web_sm')

# Ensure the upload folder exists
UPLOAD_FOLDER_FILES = 'public/assets/cv'
if not os.path.exists(UPLOAD_FOLDER_FILES):
    os.makedirs(UPLOAD_FOLDER_FILES)


def check_requirements(cv_text, requirements):
    doc = nlp(cv_text)
    entities = [ent.text for ent in doc.ents if ent.text in expected_skills]
    skills = [token.text for token in doc if token.pos_ ==
              "NOUN" and token.text in expected_skills]
    all_skills = list(set(entities + skills))

    print(f"Extracted skills: {all_skills}")

    cvSkills = {skill.lower() for skill in all_skills}
    userRequirements = [req.lower() for req in requirements]

    matched_requirements = {
        req: req.lower() in cvSkills
        for req in userRequirements
    }
    return matched_requirements


def check_cv():
    data = request.form
    cv = request.files.get('cv')
    requirements = data.get('requirements', '')

    if not cv or not requirements:
        return jsonify({'error': 'CV file and requirements are required.'}), 400

    cv_filename = secure_filename(cv.filename)
    upload_path = os.path.join(
        current_app.config['UPLOAD_FOLDER'], cv_filename)
    cv.save(upload_path)
    cv_text = extract_text_from_pdf(upload_path)
    requirements_list = [req.strip() for req in requirements.split(',')]

    results = check_requirements(cv_text, requirements_list)
    print(f"results: {results}")
    if all(results.values()):
        return jsonify({'data': results, 'message': 'This CV Match With the Requirements', 'status': 200})
    else:
        return jsonify({'message': 'This CV Does Not Match With the Requirements', 'status': 400})


def extract_text_from_pdf(pdf_path):
    """ Extracts text from a PDF file. """
    text = ''
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text() + ' '
    return text

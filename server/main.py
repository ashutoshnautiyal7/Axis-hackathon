from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from auth.user import *
from auth.hr import *
from auth.admin import *
from auth.send_email import send_email
import os
from ATS.parser import ResumeParser
from ATS.ranking import resume_ranking
from datetime import datetime
import re
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = '123456789' # Yeah the most secure key 😂
bcrypt = Bcrypt(app)
CORS(app)
logging.basicConfig(filename='api_usage.log', level=logging.INFO)

@app.route('/api')
def test():
    """
    Test Route
    """
    return jsonify({'message': 'Hello World!'})

@app.route('/api/signup', methods=['POST'])
def register():
    """
    Endpoint to register a new user.

    Required JSON data in the request body:
    {
        "email": "user@example.com",
        "username": "username",
        "password": "password"
    }

    Returns:
    - If registration is successful, returns HTTP 200 with a JSON response containing a success message and a JWT token.
    - If registration fails, returns HTTP 401 with a JSON response containing an error message.
    """
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    authenticated = register_user(email, username, password)
    if authenticated[0] == 200:
        token = generate_token(email, authenticated[1])  
        response = jsonify({'message': 'Registered successfully!', 'token': token})
        response.set_cookie('access_token', token, httponly=True, secure=True, samesite='Lax')
        return response
    else:
        return jsonify({'message': 'Registration failed!'}), 401

@app.route('/api/login', methods=['POST'])
def login():
    """
    Endpoint to login a user.

    Required JSON data in the request body:
    {
        "email": "user@example.com",
        "password": "password"
    }

    Returns:
    - If login is successful, returns HTTP 200 with a JSON response containing a success message and a JWT token.
    - If login fails, returns HTTP 401 with a JSON response containing an error message.
    """
    logging.info(f"API request: {request.method} {request.path}")
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    email_pattern = r'^.+@(gmail|yahoo|outlook|hotmail)\.[a-z]{2,}$'
    match_result = re.match(email_pattern, email)

    if match_result:
        authenticated = login_user(email, password)
        if authenticated[0] == 200:
            token = generate_token(email, authenticated[1])  
            response = jsonify({'message': 'Login successful!', 'token': token, 'user_id':authenticated[1]})
            response.set_cookie('access_token', token, httponly=True, secure=True, samesite='Lax')
            return response
        else:
            return jsonify({'message': 'Login failed!'}), 401
    elif not match_result:
        authenticated = login_hr(email,password)
        if authenticated[0] == 200:
            token = generate_token(email, authenticated[1])  
            response = jsonify({'message': 'Login successful!', 'token': token, 'hr_id':authenticated[1]})
            response.set_cookie('access_token', token, httponly=True, secure=True, samesite='Lax')
            return response
        else:
            return jsonify({'message': 'Login failed!'}), 401


@app.route('/api/user/profile', methods = ['GET','PUT'])
def user_profile():
    """
    Endpoint to get the profile of the user.
    """
    user_id = request.headers.get('X-User-ID')
    if not user_id:
         return jsonify({'error':'User ID not found'}), 404

    if request.method == 'GET':
        response = get_user_profile(user_id)
        return jsonify(response), 200
    
    if request.method == 'PUT':
        updated_data = request.get_json()
        update_user_profile(user_id,updated_data)
        return jsonify({'message':'Profile updated successfully'}), 200

@app.route('/api/user/resume', methods = ['GET','POST'])
def user_upload_resume():
    """
    Endpoint to upload/retrive a user's resume.

    Required Headers:
    {
        "X-User-ID": "<user_id>"
    }
    
    Returns:
    - If the resume is successfully uploaded, returns HTTP 200 with a JSON response containing a success message.
    - If there is no file part in the request, returns HTTP 400 with a JSON response containing an error message.
    - If no file is selected, returns HTTP 400 with a JSON response containing an error message.

    """
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({'error':'User ID not found'}), 404
    
    if request.method == "POST":

        folder_path = 'data/' + str(user_id)  
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        if 'file' not in request.files:
            return jsonify({'message': 'No file part in the request'}), 400
        
        file = request.files['file']

        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400

        file_path = folder_path + '/' + str(datetime.now().strftime('%H_%M_%S') + '_' + file.filename)
        file.save(file_path)
        update_user_profile(user_id,{"resume_path":file_path})
        return jsonify({'message': 'Resume uploaded successfully'}), 200
    
    elif request.method == 'GET':
        resume_url = get_user_profile(user_id)
        return jsonify({'resume_url':resume_url['resume_url']}), 200


@app.route('/api/userautofill', methods = ['GET','POST'])
def extract_resume():
    """
    Endpoint to extract the details from a user's resume.

    Required Headers:
    {
        "X-User-ID": "<user_id>"
    }

    Returns:
    - If the resume is successfully parsed, returns HTTP 200 with a JSON response containing the extracted details.
    - If the resume is not found, returns HTTP 404 with a JSON response containing an error message.
    """
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({'error':'User ID not found'}), 404

    if request.method == 'GET':
        resume_url = get_user_profile(user_id)
        extracted_details = ResumeParser(resume_url['resume_url']).resume_parser()
        return extracted_details
    
    elif request.method == 'POST':
        data = request.get_json()
        create_user_profile(user_id,data)
        return jsonify({'message':'Form Submitted'}), 200
    

@app.route('/api/viewjd',methods = ['GET'])
def user_view_jd():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({'error':'User ID not found'}), 404
    data = view_jd()
    return data

@app.route('/api/hr',methods=['GET', "PUT"])
def hr_profile():
    hr_id = request.headers.get('X-Hr-ID')
    if not hr_id:
        return jsonify({'error':'HR ID not found'})
    
    if request.method == 'GET':
        hr_data = get_hr_profile(hr_id)
        return jsonify(hr_data)
    
    if request.method == 'PUT':
        updated_data = request.get_json()
        print(hr_id)
        print(updated_data)
        update_hr_profile(hr_id,updated_data)
        return jsonify({'message':'Profile updated successfully'})

@app.route('/api/post_jd',methods=['POST'])
def hr_post_jd():
    hr_id = request.headers.get('X-Hr-ID')
    if not hr_id:
        return jsonify({'error':'HR ID not found'})
    data = request.get_json()
    data['hr_id'] = hr_id
    print(data)
    post_new_jd(data)
    return jsonify({'message':'Data posted successfully'}), 200

@app.route('/api/hr/rank',methods = ['POST'])
def rank_resume():
    if request.method == 'POST':
        data = request.get_json()
        jd_id = data['jd_id']
        description = data['content']
        candidates_applied = get_applied_candidates(str(jd_id))
        for candidate in candidates_applied:
            data = resume_ranking(candidate['resume_path'], description)
            candidate['score'] = data[0][1]   
        return jsonify(candidates_applied)

@app.route('/api/posted_jd',methods=['GET','PUT','DELETE'])
def hr_posted_jd():
    hr_id = request.headers.get('X-HR-ID')
    if not hr_id:
        return jsonify({'error':'HR ID not found'})
    
    if request.method == 'GET':
        all_data = posted_jd(hr_id)    
        return all_data
    
    if request.method == 'PUT':
        data = request.get_json()
        update_posted_jd(data['jd_id'],data)
        return jsonify({'message':'Data updated successfully'})
    
    if request.method == 'DELETE':
        data = request.get_json()
        delete_posted_jd(data['jd_id'])
        return jsonify({'message':'Data deleted successfully'}), 200
    

@app.route('/api/applyjd',methods= ['PUT'])
def applyjd():
    user_id = request.headers.get('X-User-ID')
    if not user_id:
        return jsonify({'error':'User ID not found'}), 404
    data = request.get_json()
    apply_jd(user_id,data['jd_id'])
    return jsonify({'Applied for' : 'user_id'})


@app.route('/api/hr/send_email', methods=['POST'])
def hr_email():
    email = "test.purposes27.5@gmail.com"
    send_password = 'fhwjldldvnoqzxel'
    data = request.get_json()
    response = send_email(email,send_password,str(data['email']),data['subject'],data['body'])
    return jsonify({"message": response})


@app.route('/api/hr/shortlist', methods=['GET','POST'])
def hr_shortlist():
    hr_id = request.headers.get('X-Hr-ID')
    if not hr_id:
        return jsonify({'error':'HR ID not found'})
    if request.method == 'GET':
        # data = request.get_json()
        response = get_shortlisted()
        return jsonify({"candidate_data": response})
    if request.method == 'POST':
        data = request.get_json()
        jd_id = data['jd_id']
        shortlisted = data['shortlisted']
        response = shortlisted_candidates(jd_id,shortlisted)
        return jsonify({"message": response})

@app.route('/api/hr/shortlist/test', methods=['GET','POST'])
def hr_shortlist_test():
    hr_id = request.headers.get('X-Hr-ID')
    if not hr_id:
        return jsonify({'error':'HR ID not found'})
    
    return jsonify({"message": "test"})

""" 
    All Admin Endpoints
"""
@app.route('/api/admin/home',methods=['GET'])
def admn_home():
    response = get_header()
    return jsonify(response)

@app.route('/api/admin/home/jd',methods=['GET','POST'])
def admn_home_jd():
    if request.method == 'GET':
        response = get_jd_status()
        return jsonify(response)

@app.route('/api/admin/home/hr',methods=['GET','POST'])
def admn_home_hr():
    if request.method == 'GET':
        response = get_all_hr()
        return jsonify(response)

    if request.method == 'POST':
        data = request.get_json()
        response = create_hr(data)
        return jsonify({'message':'HR added successfully'}), 200
    
@app.route('/api/admin/home/user',methods=['GET','POST'])
def admn_home_user():
    if request.method == 'GET':
        response = get_all_user()
        return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)

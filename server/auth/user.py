import jwt
import datetime
from supabase import create_client
import os
import bcrypt
import uuid
import base64
from Predict.res_predict import predict_category

def generate_token(user_id, secret_key):
    """
    Generate a JWT token for the given user ID.

    Parameters:
        user_id (str): The unique ID of the user.
        secret_key (str): The secret key used for encoding the token.

    Returns:
        str: The JWT token as a string.
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, secret_key, algorithm='HS256')


def login_user(email, password):
    """
    Authenticate a user based on their email and password.

    Parameters:
        email (str): The email of the user.
        password (str): The password of the user.

    Returns:
        tuple: A tuple containing the status code and the user ID.
               - If the authentication is successful, status code 200 and the user ID.
               - If the authentication fails, status code 401 and None.
    """
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    # Query the user based on the email
    data, count = supabase.table('user').select('email', 'password', 'user_id','resume_path').eq('email', email).execute() 
    if bcrypt.checkpw(password.encode('utf-8'), data[1][0]['password'].encode('utf-8')):
        return 200, data[1][0]['user_id']  # Successful login and return 'user_id'
    return 401, None  # Unauthorized (invalid credentials)



def register_user(email, username, password):
    """
    Register a new user with the given email, username, and password.

    Parameters:
        email (str): The email of the new user.
        username (str): The username of the new user.
        password (str): The password of the new user.

    Returns:
        tuple: A tuple containing the status code and the user ID.
               - If the registration is successful, status code 200 and the user ID.
               - If the registration fails, status code 401 and None.
    """
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user_id = str(uuid.uuid4())
    data, count = supabase.table('user').insert({
        "user_id": user_id,
        "email": email,
        "username": username,
        "password": hashed_password,
    }).execute()

    if data:
        return 200, user_id  # Successful registration and return 'user_id'
    return 401, None  # Failed registration

def create_user_profile(user_id, user_data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data,count = supabase.table('user').select('user_id','email','created').eq('user_id',user_id).execute()
    print(user_data)
    if data[1][0]['email'] == user_data['email'] or data[1][0]['user_id'] == user_id and data[1][0]['created'] is None: 
        _, count = supabase.table('user').update(user_data).eq('user_id',user_id).execute()
        return 200
    return 401

def get_user_profile(user_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('user').select('*').eq('user_id',user_id).execute()
    try:
        with open(data[1][0]['resume_path'], "rb") as resume_file:
            encoded_string = base64.b64encode(resume_file.read())
    except:
        encoded_string = None
   
    user_data = {
        'username':data[1][0]['username'],
        'email':data[1][0]['email'],
        'degree':data[1][0]['degree'],
        'phone':data[1][0]['phone'],
        'resume_base64': encoded_string.decode('utf-8') if encoded_string else None,
        'resume_url':data[1][0]['resume_path'],
        'skills': data[1][0]['skills'],
        'experience': data[1][0]['experience'],
        'college_name': data[1][0]['college_name'],
        'total_experience': data[1][0]['total_experience'],
        'github': data[1][0]['github'],
        'linkedin': data[1][0]['linkedin'],
        'profile': data[1][0]['profile'],
    }
    return user_data

def update_user_profile(user_id,updated_data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('user').update(updated_data).eq('user_id',user_id).execute()
    if data:
        return 200
    return 401

def view_jd():
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('jd').select('jd_id','title','description','hr_id','location','skills','end_date','salary').execute()
    if data:
        return data[1]
    return 401

def apply_jd(user_id,jd_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('jd').select('applied','jd_id').eq('jd_id',jd_id).execute()
    applied_array = []
    if data[1][0]['applied'] is not None:
        applied_array = data[1][0]['applied']
    applied_array.append(user_id)
    
    applied_array = list(set(applied_array))
    _, count = supabase.table('jd').update({'applied': applied_array}).eq('jd_id', jd_id).execute()
    if _:
        return 200  
    return 401

def applied_jd(user_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('jd').select('applied','jd_id','title','description','hr_id').execute()
    applied_jd = []
    for jd in data[1]:
        if jd['applied'] is not None and user_id in jd['applied']:
            applied_jd.append(jd)
    return applied_jd




def shortlisted_jd(user_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('jd').select('applied','jd_id','title','description','hr_id').execute()
    applied_jd = []
    for jd in data[1]:
        if jd['applied'] is not None and user_id in jd['applied']:
            applied_jd.append(jd)

    shortlisted = []
    user_shortlisted,count = supabase.table('shortlisted').select('jd_id','user_id').eq('user_id',user_id).execute()
    if user_shortlisted[1]:
        for jd in applied_jd:
            if jd['jd_id'] in user_shortlisted[1][0]['jd_id']:
                shortlisted.append(jd)

    jd_id = shortlisted[0]['jd_id']

    scheduled_data,count = supabase.table('scheduled').select('jd_id','selected_id','end_date').eq('jd_id',jd_id).execute()
    
    interview_data = {
        'jd_id': jd_id,
        'selected_id': scheduled_data[1][0]['selected_id'],
        'end_date': scheduled_data[1][0]['end_date'],
    }

    return shortlisted , interview_data


def domain_predict_category(user_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    user_data, count = supabase.table('user').select('resume_path').eq('user_id',user_id).execute()
    resume_path = user_data[1][0]['resume_path']
    with open(resume_path, 'r') as f:
        resume = f.read()
        print(resume)
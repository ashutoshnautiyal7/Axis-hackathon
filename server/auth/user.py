import jwt
import datetime
from supabase import create_client
import os
import bcrypt
import uuid
import base64

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

def get_user_profile(user_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('user').select('user_id', 'email', 'username', 'degree','phone','resume_path').eq('user_id',user_id).execute()
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
        'resume_url':data[1][0]['resume_path']
    }
    return user_data

def update_user_profile(user_id,updated_data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('user').update(updated_data).eq('user_id',user_id).execute()
    if data:
        return 200
    return 401

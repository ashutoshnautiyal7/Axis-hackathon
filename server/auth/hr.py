import jwt
import datetime
from supabase import create_client, Client
import os
import bcrypt
import uuid
import base64


def generate_token(id, secret_key):
    """
    Generate a JWT token for the given user ID.

    Parameters:
        user_id (str): The unique ID of the user.
        secret_key (str): The secret key used for encoding the token.

    Returns:
        str: The JWT token as a string.
    """
    payload = {
        'hr_id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, secret_key, algorithm='HS256')

def login_hr(email,password):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('hrdb').select('email', 'password', 'hr_id').eq('email', email).execute()
    if bcrypt.checkpw(password.encode('utf-8'), data[1][0]['password'].encode('utf-8')):
        return 200, data[1][0]['hr_id']  
    return 401

def get_hr_profile(hr_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('hrdb').select('hr_id','email','name','designation').eq('hr_id', hr_id).execute()
    hr_data = {
        'hr_id': data[1][0]['hr_id'],
        'email': data[1][0]['email'],
        'name': data[1][0]['name'],
        'designation': data[1][0]['designation']
    } 
    return hr_data

def posted_jd(hr_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jd_data, count = supabase.table('jd').select('jd_id','title','description','hr_id').eq('hr_id', hr_id).execute()
    posted_jds = []
    for i in range(len(jd_data[1])):
        jd = {
            'jd_id': jd_data[1][i]['jd_id'],
            'title': jd_data[1][i]['title'],
            'description': jd_data[1][i]['description'],
            'hr_id': jd_data[1][i]['hr_id']
        }
        posted_jds.append(jd)
    return posted_jds

def post_new_jd(data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jd_data, count = supabase.table('jd').insert({
        'jd_id': str(uuid.uuid4()),
        'title': data['title'],
        'description': data['description'],
        'hr_id': data['hr_id']
    }).execute()
    if jd_data:
        return 200
    return 401


def update_posted_jd(jd_id,updated_data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jd_data, count = supabase.table('jd').update(updated_data).eq('jd_id', jd_id).execute()
    if jd_data:
        return 200
    return 401


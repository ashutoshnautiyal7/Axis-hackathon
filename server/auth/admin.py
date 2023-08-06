import jwt
import datetime
from supabase import create_client, Client
import os
import bcrypt
import uuid
import requests

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

def login_admin(email,password):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('hrdb').select('email', 'password', 'hr_id').eq('email', email).execute()
    if bcrypt.checkpw(password.encode('utf-8'), data[1][0]['password'].encode('utf-8')):
        return 200, data[1][0]['hr_id']  
    return 401

def get_header():
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    hrdb, count = supabase.table('hrdb').select('*').execute()
    user, count = supabase.table('user').select('*').execute()
    jddb, count = supabase.table('jd').select('*').execute()
    res=requests.get('https://supabase.com/dashboard/project/guxjprxlnpoeqnbwhicy/reports/api-overview')
    if res.status_code == 200:
        data = {
            'hrdb': len(hrdb[1]),
            'user': len(user[1]),
            'jddb': len(jddb[1]),
            'status':res.status_code,
            'totaluser': (len(hrdb[1]) + len(user[1]))
        }
        return data
    return None

def get_jd_status():
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jddb, count = supabase.table('jd').select('*').execute()
    jd_data = []

    for jd in jddb[1]:
        jd_id = jd['jd_id']
        hr_id = jd['hr_id']
        applied = jd['applied']
        
        jd_data.append({
            'jd_id': jd_id,
            'hr_id': hr_id,
            'applied': applied
        })
    return jd_data



def create_hr(data):
    data['hr_id'] = str(uuid.uuid4())
    data['password'] = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    supabase.table('hrdb').insert(data).execute()
    return 200

def get_all_hr():
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    hrdb, count = supabase.table('hrdb').select('*').execute()
    return hrdb[1]

def get_all_user():
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    userdb, count = supabase.table('user').select('*').execute()
    return userdb[1]


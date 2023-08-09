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
    data, count = supabase.table('hrdb').select('hr_id','email','name','designation','company_name').eq('hr_id', hr_id).execute()
    hr_data = {
        'hr_id': data[1][0]['hr_id'],
        'email': data[1][0]['email'],
        'name': data[1][0]['name'],
        'designation': data[1][0]['designation'],
        'company_name': data[1][0]['company_name']
    } 
    return hr_data

def update_hr_profile(hr_id,data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    data, count = supabase.table('hrdb').update(data).eq('hr_id', hr_id).execute()
    return 200

def posted_jd(hr_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jd_data, count = supabase.table('jd').select('*').eq('hr_id', hr_id).execute()
    posted_jds = []
    for i in range(len(jd_data[1])):
        jd = {
            'jd_id': jd_data[1][i]['jd_id'],
            'title': jd_data[1][i]['title'],
            'description': jd_data[1][i]['description'],
            'hr_id': jd_data[1][i]['hr_id'],
            'location':jd_data[1][i]['location'],
            'qualification':jd_data[1][i]['qualification'],
            'expereince':jd_data[1][i]['expereince'],
            'salary':jd_data[1][i]['salary'],
            'skills':jd_data[1][i]['skills'],
            'end_date':jd_data[1][i]['end_date'],
            'applied': len(jd_data[1][i]['applied']) if jd_data[1][i]['applied'] else 0,
        }
        posted_jds.append(jd)
    return posted_jds

def post_new_jd(data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))

    cleaned_salary = data['salary'].replace(',', '')
    jd_data, count = supabase.table('jd').insert({
        'jd_id': str(uuid.uuid4()),
        'title': data['title'],
        'description': data['description'],
        'hr_id': data['hr_id'],
        'location':data['location'],
        'qualification':data['qualification'],
        'expereince':data['experience'],
        'salary':int(cleaned_salary),
        'skills':data['skills'],
        'end_date':data['end_date'],
    }).execute()
    if jd_data:
        return 200
    return 401


def update_posted_jd(jd_id,updated_data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    cleaned_salary = updated_data['salary'].replace(',', '')
    updated_data['salary'] = cleaned_salary
    jd_data,count = supabase.table('jd').update(updated_data).eq('jd_id',jd_id).execute()
    if jd_data:
        return 200
    return 401

def delete_posted_jd(jd_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jd_data, count = supabase.table('jd').delete().eq('jd_id', jd_id).execute()
    if jd_data:
        return 200
    return 401


def get_applied_candidates(jd_id):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    jd_data, count = supabase.table('jd').select('applied').eq('jd_id', jd_id).execute()
    applied_candidates = []
    user_data,count = supabase.table('user').select('user_id','username','email','resume_path','phone','linkedin').execute() 

    for i in range(len(jd_data[1][0]['applied'])):
        for j in range(len(user_data[1])):
            if str(jd_data[1][0]['applied'][i]) == str(user_data[1][j]['user_id']):
                user = {
                    'user_id': user_data[1][j]['user_id'],
                    'username': user_data[1][j]['username'],
                    'email': user_data[1][j]['email'],
                    'phone': user_data[1][j]['phone'],
                    'resume_path': user_data[1][j]['resume_path'],
                    'linkedin': user_data[1][j]['linkedin'],
                }
                applied_candidates.append(user)
    return applied_candidates
        

def shortlisted_candidates(jd_id,data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))    
    for i in range(len(data)):     
        jd_data, count = supabase.table('shortlisted').insert({
            'jd_id': jd_id,
            'name': data[i]['username'],
            'email': data[i]['email'],
            'phone': data[i]['phone'],
            'resume_path': data[i]['resume_path'],
            'linkedin': data[i]['linkedin'],
            'score': float(data[i]['score']),
        }).execute()
    if jd_data:
        return 200

    return 401

def get_shortlisted():
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    shortlisted_data, count = supabase.table('shortlisted').select('*').execute()
    shortlisted_candidates = []
    for i in range(len(shortlisted_data[1])):
        shortlisted_candidate = {
            'jd_id': shortlisted_data[1][i]['jd_id'],
            'name': shortlisted_data[1][i]['name'],
            'email': shortlisted_data[1][i]['email'],
            'phone': shortlisted_data[1][i]['phone'],
            'resume_path': shortlisted_data[1][i]['resume_path'],
            'linkedin': shortlisted_data[1][i]['linkedin'],
            'score': shortlisted_data[1][i]['score'],
        }
        shortlisted_candidates.append(shortlisted_candidate)
    return shortlisted_candidates

def schedule_test(data):
    supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_KEY'))
    shortlisted_data, count = supabase.table('scheduled').insert(data).execute()
    if shortlisted_data:
        return 200
    return 401
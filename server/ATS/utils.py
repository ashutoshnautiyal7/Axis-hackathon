import re
import pandas as pd
import os
import json
from nltk.corpus import stopwords
from geotext import GeoText
import geonamescache
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from datetime import datetime


def extract_name(nlp_text, matcher):
    pattern = [[{'POS': 'PROPN'}, {'POS': 'PROPN'}]]
    matcher.add('NAME', pattern)
    matches = matcher(nlp_text)
    for _, start, end in matches:
        span = nlp_text[start:end]
        matcher.remove('NAME')
        return span.text


def extract_phone(text):
    contact_number = None
    pattern = r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    match = re.search(pattern, text)
    if match:
        contact_number = match.group()
    return contact_number

def extract_email(text):
    email = None
    pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"
    match = re.search(pattern, text)
    if match:
        email = match.group()
    return email

def extract_linkedin(text):
    linkedin = None
    pattern = r"\b(?:https?://)?(?:www\.)?(?:linkedin\.com/in/)([-a-zA-Z0-9/]*)"
    match = re.search(pattern, text)
    if match:
        linkedin = match.group()
        return linkedin

def extract_github(text):
    github = None
    pattern = r"\b(?:https?://)?(?:www\.)?(?:github\.com/)([-a-zA-Z0-9/]*)"
    match = re.search(pattern, text)
    if match:
        github = match.group()
        return github
    
def extract_address(text, nlp_text):
    gc = geonamescache.GeonamesCache()
    indian_cities = [city['name'] for city in gc.get_cities().values()]
    places = GeoText(text)
    locations = [loc for loc in places.cities if loc in indian_cities]
    for ent in nlp_text.ents:
        if ent.label_ in ('GPE', 'LOC'):
            locations.append(ent.text)
    for loc in locations:
        if loc in text and loc not in ['University', 'university']:
            return loc
    return None

def extract_degree(nlp_text):
    degree_keywords = ['bachelor', 'bachelors', 'bs', 'ba',
                       'master', 'masters', 'master\'s', 'ms', 'ma',
                       'phd', 'doctorate', 'doctor', 'ph.d', 'dphil',
                       'diploma', 'degree', 'associate\'s', 'associate',
                       'b.e.', 'be', 'b.e', 'b.s', 'bsc',
                       'm.e.', 'm.e', 'm.s', 
                       'b.tech', 'btech', 'm.tech', 'mtech',
                       'm.b.a', 'mba', 'm.b.a.', 'm.a', 'ma',
                       'b.sc', 'bsc', 'm.sc', 'msc',
                       'b.c.a', 'bca', 'b.c.a.', 'm.c.a', 'mca',
                       'b.com', 'bcom', 'm.com', 'mcom',
                       'b.a', 'ba', 'b.a.', 'm.a', 'ma',
                       'bba', 'm.b.a', 'mba', 'b.b.a',
                       'b.d.s', 'bds', 'm.d.s', 'mds',
                       'm.b.b.s', 'mbbs',
                       'd.d.s', 'm.d.d.s', 'mdds'
                    ]
    text = " ".join(sent.text for sent in nlp_text.sents)
    degree_matches = re.findall(r'\b(?:' + '|'.join(degree_keywords) + r')\b(?:[\w\s.,-]+)?', text, re.IGNORECASE)
    degree_matches = list(dict.fromkeys(degree_matches))
    nltk_stopwords = set(stopwords.words('english'))
    degree = [word for word in degree_matches if word.lower() not in nltk_stopwords and len(word) > 1]
    return degree

def extract_college_name(nlp_text):
    education = []

    education_keyword = ['university','college','institute']
    for ent in nlp_text.ents:
        if ent.label_ == 'ORG' and any(keyword in ent.text.lower() for keyword in education_keyword):
            education.append(ent.text)
    education = list(dict.fromkeys(education))
    return education

def extract_skills(nlp_text, noun_chunks, skills_file=None):
    tokens = [token.text for token in nlp_text if not token.is_stop]
    if not skills_file:
        data = pd.read_csv(os.path.join(os.path.dirname(__file__), 'skills.csv'))
    else:
        data = pd.read_csv(skills_file)
    skills = list(data.columns.values)
    skillset = []
    for token in tokens:
        if token.capitalize() in skills:
            skillset.append(token)

    for token in noun_chunks:
        token = token.text.lower().strip()
        if token in skills:
            skillset.append(token)
    return [i.capitalize() for i in set([i.lower() for i in skillset])]

def extract_experience(nlp_text):
    worked_at = []
    work_data = []
    designation_list = pd.read_csv(os.path.join(os.path.dirname(__file__), 'designation.csv'))
   
    designations = [des.lower() for des in designation_list['Designations'].str.split(',').sum()]
    company_list = ['technologies', 'corporation', 'incorporated', 'group', 'company', 'corp', 'limited', 'ltd', 'llc', 'pvt', 'pvt.', 'private', 'public', 'p.l.c', 'plc', 'plc.', 'plc.']

    date_pattern = r'(?:\d{1,2}[-/]\d{4}|\w+\s\d{4})'
    current_designation = None
    for ent in nlp_text.ents:
        if ent.label_ == 'ORG' and any(keyword in ent.text.lower() for keyword in company_list):
            worked_at.append(ent.text)
        if ent.label_ == 'DATE' and re.search(date_pattern, ent.text):
            work_data.append(ent.text)

        if any(keyword in ent.text.lower() for keyword in designations):
            current_designation = ent.text
            break

    total_years = 0
    total_months = 0
    try:
        for date_range in work_data:
            date_parts = date_range.split(' - ')
            start_date_str = date_parts[0].strip()
            end_date_str = date_parts[1].strip()
            start_date = parse(start_date_str, fuzzy=True)
            end_date = parse(end_date_str, fuzzy=True)
            # Calculate difference between dates using relativedelta
            difference = relativedelta(end_date, start_date)
            total_years += difference.years
            total_months += difference.months
    except:
        pass
    total_years += total_months // 12
    total_months = total_months % 12
    tot_exp = str(total_years)+'.'+str(total_months)
    worked_at = list(dict.fromkeys(worked_at))
    return current_designation, tot_exp, worked_at

import json
import spacy
import os
from spacy.matcher import Matcher
from ATS.Pdf_extrator import pdf_parser
from ATS.Img_extrator import ocr
import docx2txt
from ATS.utils import *

class ResumeParser(object):
    def __init__(self,resume,skills_file=None,custom_regex=None):
        # if not avaible download model in python itself
        try:
            nlp = spacy.load('en_core_web_trf')
        except OSError:
            spacy.cli.download('en_core_web_trf')
            nlp = spacy.load('en_core_web_trf')
        
        # custom_nlp = spacy.load(os.path.dirname(os.path.abspath(__file__)))
        self.__resume = resume
        self.__skills_file = skills_file
        self.__custom_regex = custom_regex
        self.__matcher = Matcher(nlp.vocab)
        self.__details = {
            'name': None,
            'email': None,
            'mobile_number': None,
            'skills': None,
            'college_name': None,
            'degree': None,
            'designation': None,
            'experience': None,
            'company_names': None,
            'no_of_pages': None,
            'total_experience': None,
        }

        
        extension = os.path.splitext(self.__resume)[1]

        file_path = os.path.dirname(os.path.abspath(self.__resume)) + '/' + os.path.basename(self.__resume)
        self.__resume = file_path   
        if extension == '.pdf':
            self.__text_raw = pdf_parser(self.__resume)
        elif extension == '.jpg' or extension == '.png' or extension == '.jpeg':
            self.__text_raw = ocr(self.__resume)
        elif extension == '.docx':
            self.__text_raw = docx2txt.process(self.__resume)
        elif extension == '.txt':
            self.__text_raw = open(self.__resume, 'r').read()
        self.__text = str(self.__text_raw.split('\n'))
        self.__nlp = nlp(self.__text)
        self.__noun_chunks = list(self.__nlp.noun_chunks)
        # self.__custom_nlp = custom_nlp(self.__text)
        self.__resume = resume
        self.__get_details()

    def __get_details(self):
        name = extract_name(self.__nlp,self.__matcher)
        phone = extract_phone(self.__text)
        email = extract_email(self.__text)
        skills = extract_skills(self.__nlp,self.__noun_chunks,self.__skills_file)
        education = extract_college_name(self.__nlp)
        linkedin = extract_linkedin(self.__text)
        github = extract_github(self.__text)
        degree = extract_degree(self.__nlp)
        address = extract_address(self.__text,self.__nlp)
        current_designation,total_experience,work_place = extract_experience(self.__nlp)
        resume_data = {
            'name': name,
            'email': email,
            'mobile_number': phone,
            'skills': skills,
            'college_name': education,
            'degree': degree,
            'designation': current_designation,
            'experience': work_place,
            'total_experience': total_experience,
            'city':address,
            'linkedin_url':linkedin,
            'github_url':github
        }
        print(type(resume_data))
        json_data = json.dumps(resume_data,indent=4)
        return json_data

    def resume_parser(self):
        return self.__get_details()
            
if __name__ == '__main__':
    resume_path = ["/Users/kuldeep/Project/Axis-Hack/server/data/8c36cb44-970a-4236-bdcd-05fc4a698d65/Kuldeep's Resume.pdf","/Users/kuldeep/Project/Axis-Hack/server/data/8c36cb44-970a-4236-bdcd-05fc4a698d65/22_50_39_John Doe.pdf","/Users/kuldeep/Project/Axis-Hack/resume_Predict/data/etl-developer-resume-1.pdf","/Users/kuldeep/Project/Axis-Hack/resume_Predict/data/Data-Scientist-Resume.pdf","/Users/kuldeep/Project/Axis-Hack/resume_Predict/data/Medical Sales Representative Resume.pdf"]
    for i in range(0,len(resume_path)):
        data = ResumeParser(resume_path[i]).resume_parser()
        print(data)
        print("\n---------------------------------------------------\n")
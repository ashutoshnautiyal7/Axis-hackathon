from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from ATS.parser import ResumeParser 
import json


def preprocess_text(text):
    # for future use
    return text

def calculate_cosine_similarity(job_description, attribute_values_list):
    tfidf_vectorizer = TfidfVectorizer(preprocessor=preprocess_text)
    job_description_tfidf = tfidf_vectorizer.fit_transform([job_description])

    scores = []
    for attribute in attribute_values_list:
        if isinstance(attribute, str):
            attribute_tfidf = tfidf_vectorizer.transform([attribute])
            similarity_score = cosine_similarity(job_description_tfidf, attribute_tfidf)[0][0]
            scores.append(similarity_score)
        elif isinstance(attribute, list):
            attribute_text = ' '.join(attribute) 
            attribute_tfidf = tfidf_vectorizer.transform([attribute_text])
            similarity_score = cosine_similarity(job_description_tfidf, attribute_tfidf)[0][0]
            scores.append(similarity_score)
        else:
            scores.append(np.float64(0.0))

    return scores

def calculate_combined_score(scores, weights):
    combined_score = sum(score * weight for score, weight in zip(scores, weights))
    return combined_score

def generate_dynamic_weightage(data, attributes_order):
    total_weightage = 1
    weightage_dict = {}
    
    for idx, attribute in enumerate(attributes_order, start=1):
        attribute_value = data.get(attribute)
        if attribute_value:
            weightage_dict[attribute] = (total_weightage * (len(attributes_order) - idx + 1)) / sum(range(1, len(attributes_order) + 1))
        else:
            weightage_dict[attribute] = 0
    
    return weightage_dict

# resume_paths = ["/Users/kuldeep/Project/Axis-hackathoin/server/data/sample_resume/Data-Scientist-Resume.pdf","/Users/kuldeep/Project/Axis-hackathoin/server/data/sample_resume/etl-developer-resume-1.pdf","/Users/kuldeep/Project/Axis-hackathoin/server/data/sample_resume/Medical Sales Resume.pdf"]

def resume_ranking(resume_paths,job_description):
    # Store combined scores and resume data
    resume_scores = []
    # job description and resume data
    attributes_order = ["skills", "degree", "total_experience", "experience", "designation"]
        # Call ResumeParser with the resume path to parse the data
    resume_data = ResumeParser(resume_paths).resume_parser()

    resume_data = json.loads(resume_data)
        # Generate dynamic weightage values
    weightage_values = generate_dynamic_weightage(resume_data, attributes_order)
        # append all values to list
    attribute_values_list=[]
    for attribute, attribute_values in resume_data.items():
        attribute_values_list.append(attribute_values)
    
    # Calculate cosine similarity scores for each attribute
    cosine_similarity_scores = {}
    for attribute, attribute_values in resume_data.items():
        cosine_similarity_scores[attribute] = calculate_cosine_similarity(job_description, attribute_values_list)

    # Calculate the combined score for each attribute using dynamic weightage
    combined_scores = {}
    for attribute, scores in cosine_similarity_scores.items():
        weightage = weightage_values.get(attribute, 1)  # Default weightage is 1 if not specified
        combined_scores[attribute] = calculate_combined_score(scores, [weightage] * len(scores))


    # Calculate and store the combined score for the resume
    combined_score = sum(combined_scores[attribute] for attribute in attributes_order) * 100
    resume_scores.append((resume_paths, combined_score))
    
    
    # Sort resumes in descending order based on combined score
    sorted_resumes = sorted(resume_scores, key=lambda x: x[1], reverse=True)

    return sorted_resumes



    

# Print sorted resumes and their combined scores
if __name__ == '__main__':
    for resume, score in sorted_resumes:
        print(f"Resume: {resume} | Combined Score: {score:.2f}")

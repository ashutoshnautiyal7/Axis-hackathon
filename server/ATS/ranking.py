from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from new_parser import ResumeParser  # Make sure the import is correct based on your 'parser' module

def preprocess_text(text):
    # Add any text preprocessing steps here if required
    # For this example, we don't need any additional preprocessing
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
            attribute_text = ' '.join(attribute)  # Join the list items into a single string
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

# Sample job description and resume data
job_description = "Engineering graduate and postgraduate students from any stream and postgraduate students in Computer Science, Mathematics, Statistics, Data Science or any degree which enforces an analytical mindset are welcome to apply for the Recruitment program."

attributes_order = ["skills", "degree", "total_experience", "experience", "designation"]

resume_paths = ["/home/gladwin/Desktop/Axis-hackathoin/server/ATS/data/Data-Scientist-Resume.pdf","/home/gladwin/Desktop/Axis-hackathoin/server/ATS/data/etl-developer-resume-1.pdf","/home/gladwin/Desktop/Axis-hackathoin/server/ATS/data/Medical Sales Representative Resume.pdf"]


# Store combined scores and resume data
resume_scores = []

for i in range(0,len(resume_paths)):
    # Call ResumeParser with the resume path to parse the data
    resume_data = ResumeParser(resume_paths[i]).resume_parser()

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
    resume_scores.append((resume_paths[i], combined_score))
    print(f'Resume : {i+1} process completed !!!')

# Sort resumes in descending order based on combined score
sorted_resumes = sorted(resume_scores, key=lambda x: x[1], reverse=True)

# Print sorted resumes and their combined scores
for resume, score in sorted_resumes:
    print(f"Resume: {resume} | Combined Score: {score:.2f}")

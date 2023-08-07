from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def preprocess_text(text):
    # Add any text preprocessing steps here if required
    # For this example, we don't need any additional preprocessing
    return text.lower()

def calculate_cosine_similarity(job_description, resume_data):
    """
    Calculate the cosine similarity between the job description and each resume data attribute.

    Parameters:
        job_description (str): The job description provided by HR.
        resume_data (dict): A dictionary containing relevant information about the candidate's resume.

    Returns:
        dict: A dictionary containing cosine similarity scores for each attribute (skill, experience, education, designation).
    """
    tfidf_vectorizer = TfidfVectorizer(preprocessor=preprocess_text)
    job_description_tfidf = tfidf_vectorizer.fit_transform([job_description])

    scores = {}
    for attribute in ['skill', 'experience', 'education', 'designation']:
        attribute_text = resume_data.get(attribute, '')
        attribute_tfidf = tfidf_vectorizer.transform([attribute_text])
        similarity_score = cosine_similarity(job_description_tfidf, attribute_tfidf)[0][0]
        scores[attribute] = similarity_score

    return scores

def calculate_combined_score(skill_score, experience_score, education_score, designation_score, skill_weight=1, experience_weight=1, education_weight=1, designation_weight=1):
    """
    Calculate the combined score of a resume based on custom weightage for different attributes.

    Parameters:
        skill_score (float): Score representing the skill level of the candidate.
        experience_score (float): Score representing the experience level of the candidate.
        education_score (float): Score representing the education level of the candidate.
        designation_score (float): Score representing the designation level of the candidate.
        skill_weight (float, optional): Weightage for the skill score. Default is 1.
        experience_weight (float, optional): Weightage for the experience score. Default is 1.
        education_weight (float, optional): Weightage for the education score. Default is 1.
        designation_weight (float, optional): Weightage for the designation score. Default is 1.

    Returns:
        float: The combined score of the resume.
    """
    combined_score = (skill_score * skill_weight) + (experience_score * experience_weight) + (education_score * education_weight) + (designation_score * designation_weight)
    return combined_score

# Sample usage
#job_description = "We are looking for a skilled Python developer with 5+ years of experience, a Bachelor's degree in Computer Science, and previous experience as a team lead."
job_description = "Engineering graduate and postgraduate students from any stream and postgraduate students in Computer Science, Mathematics, Statistics, Data Science or any degree which enforces an analytical mindset are welcome to apply for the Recruitment program."

resume_data = {
    'skill': "Python, Java, C++,statistics,maths,data scientist",
    'experience': "5 years of experience in software development",
    'education': "Bachelor's degree in Computer Science",
    'designation': "Team Lead",
}

# Calculate cosine similarity scores for each attribute
cosine_similarity_scores = calculate_cosine_similarity(job_description, resume_data)

# Custom weightage for each attribute
skill_weight = 0.5
experience_weight = 0.3
education_weight = 0.2
designation_weight = 0.5

# Calculate individual scores for each attribute based on cosine similarity scores
skill_score = cosine_similarity_scores['skill'] * skill_weight
experience_score = cosine_similarity_scores['experience'] * experience_weight
education_score = cosine_similarity_scores['education'] * education_weight
designation_score = cosine_similarity_scores['designation'] * designation_weight

# Calculate the combined score
combined_score = calculate_combined_score(skill_score, experience_score, education_score, designation_score)
print("Skill Score:", skill_score*100)
print("Experience Score:", experience_score*100)
print("Education Score:", education_score*100)
print("Designation Score:", designation_score*100)
print("Combined Score:", combined_score*100)
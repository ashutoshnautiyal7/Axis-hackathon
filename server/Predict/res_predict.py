import time
start=time.time()
import pandas as pd
import numpy as np
import PyPDF2
import os
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from joblib import dump, load


"""
Category = ['Data Science', 'HR', 'Advocate', 'Arts', 'Web Designing',
       'Mechanical Engineer', 'Sales', 'Health and fitness',
       'Civil Engineer', 'Java Developer', 'Business Analyst',
       'SAP Developer', 'Automation Testing', 'Electrical Engineering',
       'Operations Manager', 'Python Developer', 'DevOps Engineer',
       'Network Security Engineer', 'PMO', 'Database', 'Hadoop',
       'ETL Developer', 'DotNet Developer', 'Blockchain', 'Testing']
"""


# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_file_path):
    extract_start=time.time()
    with open(pdf_file_path, "rb") as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    extract_end=time.time()
    print("extract time : ",((extract_end-extract_start) * 10**3)/1000, "s")
    return text

# Load the dataset containing "Category" and "Resume" columns
df = pd.read_csv("data/UpdatedResumeDataSet.csv") 

# Preprocess the resume text (e.g., tokenization, vectorization)
vectorizer = CountVectorizer(stop_words="english")
X = vectorizer.fit_transform(df["Resume"])
y = df["Category"]

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the machine learning model and save it to a file using joblib
model_filename = "data/resume_classifier_model.joblib"


if not os.path.exists(model_filename):
    model_new_start=time.time()
    classifier = MultinomialNB()
    classifier.fit(X_train, y_train)
    dump(classifier, model_filename)
    loaded_classifier = load(model_filename)
    model_new_end=time.time()
    print("model new time : ",((model_new_end-model_new_start) * 10**3)/1000, "s")
else:
    model_old_start=time.time()
    # Load the model from the saved file
    loaded_classifier = load(model_filename)
    model_old_end=time.time()
    print("model old time : ",((model_old_end-model_old_start) * 10**3)/1000, "s")



# Use the loaded model to predict the category of a new resume
def predict_category(resume_text):
    predict_start=time.time()
    # Preprocess the input resume text using the same vectorizer
    input_resume_vector = vectorizer.transform([resume_text])

    # Use the loaded classifier to predict the category
    predicted_category = loaded_classifier.predict(input_resume_vector)
    predict_end=time.time()
    print("predict time : ",((predict_end-predict_start) * 10**3)/1000, "s")
    return predicted_category[0]

# Main Part
if __name__ == "__main__":
    # Input file path
    input_pdf_file_path = "data/Data-Scientist-Resume.pdf"

    # Extract text from the PDF file
    input_resume_text = extract_text_from_pdf(input_pdf_file_path)

    # Predict the category of the input resume
    predicted_category = predict_category(input_resume_text)

    end=time.time()
    print("full time : ",((end-start) * 10**3)/1000, "s")
    print("Predicted Category:", predicted_category)
from langchain import OpenAI, LLMChain, PromptTemplate
from langchain.memory import ConversationBufferWindowMemory

def MCQGen(num_questions, difficulty_level, topic):

    template = """ 
    You are an AI bot that aids exam setters in generating MCQ questions.
    Below is the information you need to generate.
    You have to generate {num_questions} questions with 4 options as an array, indicating the index position of the correct answer. The questions should be of difficulty level {difficulty_level} and the topic is {topic}.

    Please return the answers in the JSON format as an array  
    """
    prompt_template = PromptTemplate(input_variables=["num_questions", "difficulty_level", "topic"],template=template)
    
    chatgpt_chain = LLMChain(llm=OpenAI(temperature=0.5, openai_api_key='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'),prompt=prompt_template)
    output_response = []
    while num_questions > 0:
        questions_to_generate = min(4, num_questions)
        output = chatgpt_chain.predict(num_questions=questions_to_generate, difficulty_level=difficulty_level, topic=topic)

        output_response.append(output)
        num_questions -= questions_to_generate


    return output_response
    
if __name__ == "__main__":
    output = MCQGen(10, "easy", "python developer")
    print(output)


    
    


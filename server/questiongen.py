from langchain import OpenAI, ConversationChain, LLMChain, PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
import os

def MCQGen(num_questions, difficulty_level, topic):

    print(num_questions, difficulty_level, topic)
    template = """ 
    You are an helpful AI bot the aids exam setters in setting MCQ questions.
    Below is the information that you need to generate.
    You have to generate {num_questions} questions with 4 options as an array and index position of correct answer with difficulty level {difficulty_level} and the topic you have to generate the interview questions is {topic}.

    Please return the answer in the JSON format you have generated.
    """
    prompt_template = PromptTemplate(input_variables=[ "num_questions", "difficulty_level", "topic"], template=template)

    chatgpt_chain = LLMChain(
    llm=OpenAI(temperature=0,openai_api_key=OPENAI_API_KEY),
    prompt=prompt_template,
    verbose=True,
    memory=ConversationBufferWindowMemory(k=2),
    )

    output = chatgpt_chain.predict()
    print(output)
    return output
    
if __name__ == "__main__":
    # MCQGen(10, "easy", "maths") 
    # Get env
    OPENAI_API_KEY = os.environ.get('SUPABASE_KEY')
    print(OPENAI_API_KEY)

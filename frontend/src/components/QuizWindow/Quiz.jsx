import React from "react";
import { useEffect, useMemo, useState } from "react";

function Quiz() {
  const data = [
    {
      id: 1,
      question: "Rolex is a company that specializes in what type of product?",
      options: [
        {
          text: "Phone",
          correct: false,
          marked: false,
        },
        {
          text: "Watches",
          correct: true,
          marked: false,
        },
        {
          text: "Food",
          correct: false,
          marked: false,
        },
        {
          text: "Cosmetic",
          correct: false,
          marked: false,
        },
      ],
    },
    {
      id: 2,
      question: "When did the website `Facebook` launch?",
      options: [
        {
          text: "2004",
          correct: true,
          marked: false,
        },
        {
          text: "2005",
          correct: false,
          marked: false,
        },
        {
          text: "2006",
          correct: false,
          marked: false,
        },
        {
          text: "2007",
          correct: false,
          marked: false,
        },
      ],
    },
    {
      id: 3,
      question: "Who played the character of Harry Potter in the movie?",
      options: [
        {
          text: "Johnny Depp",
          correct: false,
          marked: false,
        },
        {
          text: "Leonardo DiCaprio",
          correct: false,
          marked: false,
        },
        {
          text: "Denzel Washington",
          correct: false,
          marked: false,
        },
        {
          text: "Daniel Radcliffe",
          correct: true,
          marked: false,
        },
      ],
    },
    {
      id: 4,
      question: "What is the largest planet in our solar system?",
      options: [
        {
          text: "Earth",
          correct: false,
          marked: false,
        },
        {
          text: "Mars",
          correct: false,
          marked: false,
        },
        {
          text: "Jupiter",
          correct: true,
          marked: false,
        },
        {
          text: "Saturn",
          correct: false,
          marked: false,
        },
      ],
    },
    {
      id: 5,
      question:
        "Which famous scientist developed the theory of general relativity?",
      options: [
        {
          text: "Isaac Newton",
          correct: false,
          marked: false,
        },
        {
          text: "Albert Einstein",
          correct: true,
          marked: false,
        },
        {
          text: "Stephen Hawking",
          correct: false,
          marked: false,
        },
        {
          text: "Galileo Galilei",
          correct: false,
          marked: false,
        },
      ],
    },

    {
      id: 6,
      question:
        "Which planet is known as the 'Morning Star' or 'Evening Star'?",
      options: [
        {
          text: "Mars",
          correct: false,
          marked: false,
        },
        {
          text: "Venus",
          correct: true,
          marked: false,
        },
        {
          text: "Mercury",
          correct: false,
          marked: false,
        },
        {
          text: "Neptune",
          correct: false,
          marked: false,
        },
      ],
    },
    {
      id: 7,
      question: "What is the chemical symbol for water?",
      options: [
        {
          text: "H2O",
          correct: true,
          marked: false,
        },
        {
          text: "CO2",
          correct: false,
          marked: false,
        },
        {
          text: "O2",
          correct: false,
          marked: false,
        },
        {
          text: "NaCl",
          correct: false,
          marked: false,
        },
      ],
    },
    {
      id: 8,
      question: "Which famous scientist developed the theory of relativity?",
      options: [
        {
          text: "Isaac Newton",
          correct: false,
          marked: false,
        },
        {
          text: "Albert Einstein",
          correct: true,
          marked: false,
        },
        {
          text: "Galileo Galilei",
          correct: false,
          marked: false,
        },
        {
          text: "Niels Bohr",
          correct: false,
          marked: false,
        },
      ],
    },
    {
      id: 9,
      question: "What is the largest organ in the human body?",
      options: [
        {
          text: "Heart",
          correct: false,
          marked: false,
        },
        {
          text: "Liver",
          correct: false,
          marked: false,
        },
        {
          text: "Brain",
          correct: false,
          marked: false,
        },
        {
          text: "Skin",
          correct: true,
          marked: false,
        },
      ],
    },
    {
      id: 10,
      question: "Which gas do plants primarily release during photosynthesis?",
      options: [
        {
          text: "Carbon Dioxide",
          correct: false,
          marked: false,
        },
        {
          text: "Oxygen",
          correct: true,
          marked: false,
        },
        {
          text: "Hydrogen",
          correct: false,
          marked: false,
        },
        {
          text: "Nitrogen",
          correct: false,
          marked: false,
        },
      ],
    },

    // Add more questions here
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };
  const goToNextQuestion = () => {
    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const setQuestion = (id) => {
    setCurrentQuestionIndex(id - 1);
  };

  return (
    <div className="bg-gray-900 h-screen flex  items-center justify-center text-white py-16">
      <div className="bg-gray-900  flex flex-col items-start justify-center text-white py-16 w-[48rem]  -ml-64">
        <div className="mb-8 text-3xl font-semibold">
          {currentQuestionIndex + 1}. {data[currentQuestionIndex].question}
        </div>

        <div className="grid grid-cols-2 gap-16">
          {data[currentQuestionIndex].options.map((item, index) => (
            <div
              key={index}
              className={`px-32 py-4 bg-gray-700 rounded-md cursor-pointer ${
                item.marked
                  ? "bg-green-500 hover:bg-green-600"
                  : "hover:bg-sky-600 transition-colors duration-300"
              }`}
              onClick={() => {
                const updatedData = data.map((question, qIndex) => {
                  if (qIndex === currentQuestionIndex) {
                    const updatedOptions = question.options.map(
                      (option, oIndex) => ({
                        ...option,
                        marked: oIndex === index,
                      })
                    );
                    return { ...question, options: updatedOptions };
                  }
                  return question;
                });
                setCurrentQuestionIndex(currentQuestionIndex);
              }}
            >
              {item.text}
            </div>
          ))}
        </div>

        <div className="flex mt-8 space-x-4">
          <button
            className="px-4 py-2 outline outline-sky-500 text-white rounded-md hover:bg-sky-500 transition-colors duration-300"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 outline outline-sky-500 text-white rounded-md hover:bg-sky-500 transition-colors duration-300"
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === data.length - 1}
          >
            Next
          </button>
        </div>
      </div>
      <div className="bg-gray-700 p-4  fixed pt-96 right-0 h-screen">
        <div className="flex flex-col justify-center items-center ">
          <div className="font-bold text-green-300">Questions</div>
          <div className="grid grid-cols-5 gap-4">
            {data.map((item,index) => (
              <button
                key={item.id}
                onClick={() => setQuestion(item.id)}
                className=" h-5 w-5 m-4"
              > {index + 1} </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;

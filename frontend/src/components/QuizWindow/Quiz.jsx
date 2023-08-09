import React from "react";
import { useEffect, useMemo, useState } from "react";
function Timer({ initialTime, onTimeout }) {
  const [seconds, setSeconds] = useState(initialTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds > 1) {
          return prevSeconds - 1;
        } else {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onTimeout]);

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <p className="text-lg font-semibold mb-2">Time left: {seconds} seconds</p>
      <div className="h-2 w-full bg-gray-200 rounded-lg">
        <div
          className="h-2 bg-blue-500 rounded-lg"
          style={{ width: `${(seconds / initialTime) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}

function Quiz() {
  const data = [
    {
      id: 1,
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: 1,
    },
    {
      id: 2,
      question: "What is the largest mammal?",
      options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
      answer: 1,
    },
    {
      id: 3,
      question: "Which gas do plants use for photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"],
      answer: 1,
    },
    {
      id: 4,
      question: "What is the capital city of Japan?",
      options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
      answer: 2,
    },
    {
      id: 5,
      question: "Who painted the Mona Lisa?",
      options: [
        "Pablo Picasso",
        "Leonardo da Vinci",
        "Vincent van Gogh",
        "Michelangelo",
      ],
      answer: 1,
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [showNextQuestion, setShowNextQuestion] = useState(false);

  const [markedOptions, setMarkedOptions] = useState(
    new Array(data.length).fill(null)
  );

  const goToNextQuestion = () => {
    if (currentQuestionIndex < data.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
    setShowNextQuestion(false);
  };

  const setQuestion = (id) => {
    setCurrentQuestionIndex(id - 1);
  };

  const handleOptionClick = (selectedOptionIndex) => {
    const updatedMarkedOptions = [...markedOptions];
    updatedMarkedOptions[currentQuestionIndex] = selectedOptionIndex;
    setMarkedOptions(updatedMarkedOptions);
    setShowNextQuestion(true);

    setTimeout(goToNextQuestion, 500); // Delayed transition to next question
  };

  const currentQuestion = data[currentQuestionIndex];

  console.log(markedOptions);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentQuestionIndex < data.length - 1) {
        goToNextQuestion();
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timeout);
  }, [currentQuestionIndex, data.length]);

  useEffect(() => {
    // Calculate total marks

    let currentTotal = 0;
    for (let i = 0; i < data.length; i++) {
      if (markedOptions[i] === data[i].answer) {
        currentTotal++;
      }
    }
    setTotal(currentTotal);
  }, [markedOptions, currentQuestionIndex, data]);

  console.log("the total marks are ", total);

  if (currentQuestionIndex !== data.length) {
    return (
      <div className="bg-gray-900 h-screen flex items-center justify-center text-white py-16">
        <div className="bg-gray-900  flex flex-col items-start justify-center text-white py-16 w-[48rem]  -ml-64">
          <div className="mb-8 text-3xl font-semibold">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </div>

          <div className="grid grid-cols-2 gap-16">
            {currentQuestion.options.map((item, index) => (
              <div
                key={index}
                className={`px-32 py-4 bg-gray-700 rounded-md cursor-pointer ${
                  index === markedOptions[currentQuestionIndex]
                    ? index === currentQuestion.answer
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-500 hover:bg-red-600"
                    : "hover:bg-sky-600 transition-colors duration-300"
                }`}
                onClick={() => handleOptionClick(index)}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex mt-8  ">
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
          <Timer
            key={currentQuestionIndex} // This key ensures the timer component is re-rendered when the question changes
            initialTime={30}
            onTimeout={goToNextQuestion}
          />
          <div className="flex flex-col justify-center items-center ">
            <div className="font-bold text-green-300 mt-20">Questions</div>
            <div className="grid grid-cols-5 gap-4">
              {data.map((item) => (
                <button
                  key={item.id}
                  // onClick={() => setQuestion(item.id)}
                  className={`h-5 w-5 m-4 ${
                    item.id === currentQuestionIndex + 1 ? "bg-sky-500" : ""
                  }`}
                >
                  {item.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Test has been submitted successfully </div>;
  }
}

export default Quiz;

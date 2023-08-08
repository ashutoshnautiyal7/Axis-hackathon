import { useEffect, useState } from "react";

export default function Trivia({
  data,
  questionNumber,
  setQuestionNumber,
  setTimeOut,
}) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [className, setClassName] = useState("answer");

  useEffect(() => {
    setQuestion(data[questionNumber - 1]);
  }, [data, questionNumber]);

  const handleClick = (a) => {
    // Only proceed if no answer has been selected yet
    if (!selectedAnswer) {
      setSelectedAnswer(a);
      setClassName("answer active");

      // Evaluate the answer
      setClassName(a.correct ? "answer correct" : "answer wrong");

      // Proceed after 3 seconds for correct/wrong animation
      setTimeout(() => {
        if (a.correct) {
          setQuestionNumber((prev) => prev + 1);
        } else {
          setTimeOut(true);
        }

        // Reset selected answer and class after 1 second
        setTimeout(() => {
          setSelectedAnswer(null);
          setClassName("answer");
        }, 1000);
      }, 3000);
    }
  };

  return (
    <div className="trivia">
      <div className="question">{question?.question}</div>
      <div className="answers">
        {question?.answers.map((a) => (
          <div
            className={selectedAnswer === a ? className : "answer"}
            onClick={() => handleClick(a)}
          >
            {a.text}
          </div>
        ))}
      </div>
    </div>
  );
}

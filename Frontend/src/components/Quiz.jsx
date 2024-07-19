import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Upload from "./Upload";
import { useSelector } from "react-redux";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [loading, setLoading] = useState(false);
  const file = useSelector((state) => state.file.fileName);

  const dataFetching = async () => {
    if (!file) {
      toast.error("Please Upload file to proceed");
      return;
    }
    setLoading(true); // Start loading
    try {
      const response = await axios.get("http://localhost:8000/quiz/");
      setQuestions(response.data.data[0].questions);
      setGenerate(true); // Set generate to true if data is fetched
    } catch (error) {
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false); // End loading
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setIndex(0);
    setSelectedOption(null);
    setCorrectAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setGenerate(false);
    dataFetching();
  };

  useEffect(() => {
    console.log("Current index:", index);
  }, [index]);

  const quizGeneration = () => {
    dataFetching(); // Fetch data when button is clicked
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setCorrectAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const checkCorrect = (idx) => {
    const isTrueFalse = questions[index]?.type === "true_false";
    const isCorrect = isTrueFalse
      ? questions[index]?.answer === (idx === "true")
      : questions[index]?.answer === idx;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setSelectedOption(idx);
    setCorrectAnswer(questions[index]?.answer);
  };

  const renderChoices = () => {
    if (questions[index]?.type === "true_false") {
      return ["true", "false"].map((choice, idx) => {
        const isSelected = selectedOption === choice;
        const isCorrect = correctAnswer === (choice === "true");
        const backgroundColor = isSelected
          ? isCorrect
            ? 'bg-green-300'
            : 'bg-red-300'
          : 'bg-white';

        return (
          <li
            key={idx}
            onClick={() => checkCorrect(choice)}
            className={`cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-left ${backgroundColor}`}
            style={{ width: "60%" }}
          >
            {choice}
          </li>
        );
      });
    } else if (questions[index]?.type === "multiple_choice") {
      return questions[index]?.choices?.map((choice, idx) => {
        const isSelected = selectedOption === idx;
        const isCorrect = correctAnswer === idx;
        const backgroundColor = isSelected
          ? isCorrect
            ? 'bg-green-300'
            : 'bg-red-300'
          : 'bg-white';

        return (
          <li
            key={idx}
            onClick={() => checkCorrect(idx)}
            className={`cursor-pointer py-2 px-4 border border-gray-300 rounded-md text-left ${backgroundColor}`}
            style={{ width: "60%" }}
          >
            {choice}
          </li>
        );
      });
    }
    return null;
  };

  return (
    <div className="flex h-full w-full justify-evenly pt-7">
      <div className="bg-gray-800 h-5/6 w-3/4 rounded-xl text-center flex justify-center align-middle flex-col">
        <div className="text-3xl text-white border-b-2 pb-3">
          <h2>Quiz</h2>
        </div>

        {quizCompleted ? (
          <div className="w-full h-4/5 mb-4 ml pl-5 pt-12">
            <p className="text-2xl text-white">Your final score is: {score}/{questions.length}</p>
            <button
              onClick={resetQuiz}
              type="button"
              className="py-2.5 px-5 mt-4 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
            >
              Reset Quiz
            </button>
          </div>
        ) : (
          <>
            {generate ? (
              questions.length > 0 ? (
                <div className="w-full h-4/5 mb-4 ml pl-5 pt-12">
                  <div className="text-left text-white mb-4">
                    <p className="text-2xl">{questions[index]?.question}</p>
                  </div>
                  <div>
                    <ul className="space-y-4 text-left">
                      {renderChoices()}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="w-full h-4/5 mb-4 ml pl-5 pt-12">
                  <button
                    onClick={quizGeneration}
                    type="button"
                    className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
                  >
                    Generate Quiz
                  </button>
                </div>
              )
            ) : (
              <div className="w-full h-4/5 mb-4 ml pl-5 pt-12">
                {loading ? (
                  <button
                    disabled
                    type="button"
                    className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#1C64F2"
                      />
                    </svg>
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={quizGeneration}
                    type="button"
                    className="py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
                  >
                    Generate Quiz
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {!quizCompleted && generate && (
          <div>
            <button
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
              onClick={handleNext}
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Next
              </span>
            </button>
          </div>
        )}
      </div>

      <Upload />
    </div>
  );
};

export default Quiz;

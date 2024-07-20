import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Typewriter from "./TypeWriter"; // Assuming this component is already created
import { useSelector } from "react-redux";

const Youtube = () => {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Function to handle the submission of the URL
  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await axios.post("http://localhost:8000/summarize/youtube/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSummary(response.data.data);
      setShowQuiz(false); // Show summary, hide quiz
    } catch (error) {
      toast.error("Failed to fetch summary.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the generation of quiz questions
  const handleGenerateQuiz = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await axios.post("http://localhost:8000/quiz/", formData);
      setQuestions(response.data.data[0].questions);
      setSummary(""); // Clear summary
      setShowQuiz(true); // Show quiz
      // Reset quiz state
      setIndex(0);
      setSelectedOption(null);
      setCorrectAnswer(null);
      setScore(0);
      setQuizCompleted(false);
    } catch (error) {
      toast.error("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  // Handle the quiz navigation
  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setCorrectAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  // Check if the selected option is correct
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

  // Render choices based on question type
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
      <div className="bg-gray-800 h-5/6 w-3/4 rounded-xl flex flex-col">
        <div className="w-full rounded-lg flex justify-between" style={{ height: "10%" }}>
          <input
            type="text"
            placeholder="Please enter your YouTube video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="rounded-lg pl-3"
            style={{ width: "80%", height: "100%" }}
          />

          <div style={{ height: "100%", width: "18%" }}>
            <button
              onClick={handleSubmit}
              className={`h-full w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <span className="h-full w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                {loading ? "Loading..." : "Submit"}
              </span>
            </button>
          </div>
        </div>

        <div className="w-full  p-2 overflow-y-scroll scrollbar-hidden" style={{ minHeight: "80%" }}>
          {showQuiz ? (
            quizCompleted ? (
              <div className="w-full h-4/5 mb-4 ml pl-5 pt-12">
                <p className="text-2xl text-white">Your final score is: {score}/{questions.length}</p>
              </div>
            ) : (
              <div className="w-full h-4/5 mb-4 ml pl-5 pt-12">
                <div className="text-left text-white mb-4">
                  <p className="text-2xl">{questions[index]?.question}</p>
                </div>
                <div>
                  <ul className="space-y-4 text-left">
                    {renderChoices()}
                  </ul>
                </div>
                <button
                  onClick={handleNext}
                  className="relative mt-4 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Next
                  </span>
                </button>
              </div>
            )
          ) : (
            <div>
              {summary && <Typewriter summary={summary} />}
            </div>
          )}
        </div>

        <div className="w-full h-4/5 mb-4 ml pl-5 pt-2" style={{ height: "10%" }}>
          <button
            onClick={handleGenerateQuiz}
            type="button"
            className={`py-2.5 px-5 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Youtube;

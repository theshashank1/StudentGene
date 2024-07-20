import React, { useState, useEffect } from 'react';

const Typewriter = ({summary=""}) => {
  const [text, setText] = useState();
 
  const fullText =summary|| "Student Geni is your personalized study companion, designed to make learning more interactive and efficient. Our platform allows students to upload their subject PDFs, enabling our advanced AI model to learn and understand the content. Based on this knowledge, Student Geni generates customized quizzes to help you assess and enhance your understanding of the material.";

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(intervalId);
      }
    }, 50); // Adjust the speed by changing the interval duration
    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <div className="font-mono text-white ">
      {text}
    </div>
  );
};

export default Typewriter;

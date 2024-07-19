import React from "react";
import Typewriter from "./TypeWriter";

const Home = () => {
  return(
    <div className="h-screen pr-4 pt-10 md:w-2/3">
      <div className="bg-gray-800 flex flex-col justify-evenly align-middle p-5 rounded-2xl h-56 ">
        <div className="text-white font-semibold text-4xl pl-5 pt-5">
            <h1 >Welcome to Student Genie</h1>
            <h1  className="text-2xl">Empower Your Learning with Intelligent Tools</h1>
        </div>
        
        <div className="bg-customRed text-white w-32 h-8 text-lg rounded-lg text-center ml-4">
          Get Started
        </div>

      </div>
      <div className="bg-gray-800 p-5 rounded-2xl h-60 max-h-72 md:w-4/5 mt-7  text-white text-lg ">
         <Typewriter/>
      </div>
    </div>
  )
};

export default Home;

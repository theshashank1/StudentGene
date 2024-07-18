import React from "react";

const Home = () => {
  return(
    <div className="h-screen pr-4 mt-10 md:w-2/3">
      <div className="bg-gray-800 flex flex-col justify-evenly align-middle p-5 rounded-2xl h-56 ">
        <div className="text-white font-semibold text-4xl pl-5 pt-5">
            <h1 >Start Learning</h1>
            <h1  >Choose your Companion</h1>
        </div>
        
        <div className="bg-customRed text-white w-32 h-8 text-lg rounded-lg text-center">
          Get Started
        </div>

      </div>
      <div className="bg-gray-800 p-5 rounded-2xl h-60 md:w-3/5 mt-7 ">
        <h2>HEll0</h2>

      </div>
    </div>
  )
};

export default Home;

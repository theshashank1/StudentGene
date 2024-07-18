import React from 'react';
import { FaHome, FaUser, FaComments, FaCog,FaBook } from 'react-icons/fa';
import { MdQuiz } from 'react-icons/md';
import { Link } from 'react-router-dom';
const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-300 w-20 p-4 flex flex-col rounded-3xl ml-5 mt-10">
    
      <nav className="flex flex-col space-y-4 justify-evenly h-full ">
        <Link to="/" className="flex items-center justify-center md:justify-start space-x-2 p-2 hover:bg-gray-800 rounded">
        <FaBook className="text-lg md:text-2xl" />
        </Link>

        <Link to="/" className="flex items-center justify-center md:justify-start space-x-2 p-2 hover:bg-gray-800 rounded">
          <FaHome className="text-lg md:text-2xl" />
         
        </Link>
        
        <Link to="/chat" className="flex items-center justify-center md:justify-start space-x-2 p-2 hover:bg-gray-800 rounded">
          <FaComments className="text-lg md:text-2xl" />
       
        </Link>
        
        <Link to="/quiz" className="flex items-center justify-center md:justify-start space-x-2 p-2 hover:bg-gray-800 rounded">
          <MdQuiz  className="text-lg text-white md:text-2xl" />
        </Link>

        <Link to="/user" className="flex items-center justify-center md:justify-start space-x-2 p-2 hover:bg-gray-800 rounded">
          <FaUser className="text-lg md:text-2xl" />
       
        </Link>
        
      </nav>
    </div>
  );
};

export default Sidebar;

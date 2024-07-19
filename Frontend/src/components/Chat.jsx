import React, { useState } from "react";
import { MdSend } from 'react-icons/md';
import axios from 'axios';
import Upload from "./Upload";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const file = useSelector((state) => state.file.fileName);
  const handleSend = async () => {
    if (!file) {
      toast.error("Please Upload file to proceed");
      return; 
    }

    if (!message.trim()) return; // Do nothing if the message is empty

    // Update chat with the user message
    setChatMessages(prevMessages => [...prevMessages, { text: message, type: 'user' }]);

    try {
      const formData = new FormData();
      formData.append('question', message);
      // Send the message to the backend
      const response = await axios.post('http://localhost:8000/chat/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
     console.log(response)
      
      // Add the response from the backend to the chat
    setChatMessages(prevMessages => [...prevMessages, { text: response.data.data, type: 'bot' }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error if needed
    }

    // Clear the input field
    setMessage("");
  };

  return (
    <div className="flex h-full w-full justify-evenly pt-7">
      <div className="bg-gray-800 h-5/6 w-3/4 border-gray-50 rounded-xl flex flex-col">
        <div style={{ height: "88%", overflowY: "auto", padding: "10px", width:"100%" }}>
          {chatMessages.length==0? 
             (
              <div className="w-full h-full pl-10 text-white">

              <p className="text-3xl">Clear your doubts here ...?</p>
              

             </div>
             )
          :
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-lg ${msg.type === 'user' ? 'bg-red-400 text-white' : 'bg-gray-700 text-white'}`}
              style={{
                maxWidth: "40%",
                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                // textAlign: msg.type === 'user' ? 'right' : 'left',
                marginLeft: msg.type === 'user' ? 'auto' : '0',
                marginRight: msg.type === 'user' ? '0' : 'auto'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div style={{ height: "10%", border: "2px solid #f76d7d", width: "100%" }} className="mt-2 rounded-xl flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-full bg-transparent outline-none text-white pl-4 pr-4"
            style={{ width: "90%" }}
            placeholder="Enter your Query?"
          />
          <MdSend
            className="md:ml-10 text-3xl text-center mt-2 cursor-pointer"
            style={{ color: "#f76d7d" }}
            onClick={handleSend}
          />
        </div>
      </div>
      <Upload />
    </div>
  );
};

export default Chat;

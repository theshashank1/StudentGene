import React, { useState } from "react";
import { MdSend } from 'react-icons/md';
import axios from 'axios';
import Upload from "./Upload";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return; // Do nothing if the message is empty

    // Update chat with the user message
    setChatMessages(prevMessages => [...prevMessages, { text: message, type: 'user' }]);

    try {
      // Send the message to the backend
      const response = await axios.post('YOUR_BACKEND_URL_HERE', { message });
      
      // Add the response from the backend to the chat
    setChatMessages(prevMessages => [...prevMessages, { text: "hello", type: 'bot' }]);
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
          {chatMessages.map((msg, index) => (
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

import React from "react";
import { MdSend } from 'react-icons/md';
import Upload from "./Upload";
const Chat = () => {
  return(
    <div className="flex h-full w-full justify-evenly pt-7">
      <div className="bg-gray-800 h-5/6 w-3/4 border-gray-50 rounded-xl">
          <div style={{height:"88%"}}>

          </div>
          <div style={{height:"10%",border:"2px solid #f76d7d",width:"100%"}} className="mt-2 rounded-xl flex" >

            <input type="text" className=" h-full bg-transparent outline-none text-white pl-4 pr-4" style={{width:"90%"}} placeholder="Enter your Query ?" />
            <MdSend className="md:ml-10 text-3xl text-center mt-2  cursor-pointer" style={{color:"#f76d7d"}}/>
            

          </div>

          </div>
      <Upload/>
      
    </div>
  )
};

export default Chat;

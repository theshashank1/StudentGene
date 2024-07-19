import React from "react";

const Upload = () => {
  return (
    <>
    <div className="bg-gray-800 h-5/6 w-1/5 rounded-xl">

<div style={{height:"10%",borderBottom:"2px solid white"}} className="text-center p-3 text-2xl text-white">
 <p>Input Files</p>

</div>
<div className="flex flex-col justify-between pl-5 pr-5 mt-5" style={{height:"80%"}}>
   <div className="text-white">
     <p>Machine.pdf</p>
   </div>
   <div className="w-full text-white text-center rounded-xl h-10 font-bold p-2" style={{background:"#f76d7d"}}>
     <button>Upload</button>
   </div>
</div>

</div>
    </>
  )
};

export default Upload;

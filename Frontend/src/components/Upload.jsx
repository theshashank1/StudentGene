import React, { useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { setFile } from "../store/fileSlice";
import axios from "axios";

const Upload = () => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState(null);
  const dispatch = useDispatch();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles(file.name);
      dispatch(setFile({ fileName: file.name }));
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        // Upload the file to the server
        const response = await axios.post('http://localhost:8000/api/files/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('File uploaded successfully:', response.data);
      } catch (error) {
        console.error('Error uploading file:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error("Failed to Upload File");
    }
  };

  return (
    <>
      <div className="bg-gray-800 h-5/6 w-1/5 rounded-xl">
        <div style={{ borderBottom: "2px solid white", maxHeight:"20%" }} className="text-center p-3 text-2xl text-white">
          <p>Input Files</p>
        </div>
        <div className="flex flex-col justify-between pl-5 pr-5 mt-5 md:mt-12 overflow-hidden" style={{ height: "70%" }}>
          <div className="text-white">
            <p>{files}</p>
          </div>
          <div className="w-full text-white text-center rounded-xl h-10 font-bold p-2" style={{ background: "#f76d7d"}}>
            <button onClick={handleUploadClick} className="w-full h-full rounded-xl">
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;

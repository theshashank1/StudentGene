import React from 'react';
import { Sidebar,Home,Chat,Quiz } from './components';
import { Routes,Route } from 'react-router-dom';
function App() {
  return (
    <div className="flex bg-black h-screen">
      <Sidebar />
      <div className="flex-grow pl-4">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/quiz' element={<Quiz/>}/>
        
        </Routes>
      </div>
    </div>
  );
}

export default App;

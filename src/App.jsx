import { useState } from 'react'
import Form from './routes/Auth'
import Homepage from './routes/Homepage'
import Profile from './routes/Profilepage';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Home } from '@mui/icons-material';

function App() {
  return (
    <div className='flex w-full h-fit justify-center items-center'>
      
      <Routes>
        <Route path="/home" exact element={<Homepage/>}/>
        <Route path='/' exact element={<Form/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </div>
  )
}

export default App

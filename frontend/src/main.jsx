import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import OtpScreen from './pages/OtpScreen.jsx'
import Dashboard from './pages/dashboard.jsx'
import { mailContext, uuidContext, authenticatedContext } from './context.js'
import { useState } from 'react'

export const ENDPOINT = 'http://localhost:3010';
//the random token used inside the backend .env file
export const TOKEN = "2917js8+_287naj810s00c0aw0";

const RenderApp = () =>{
  const [mail, setMail] = useState("");
  const [uuid, setUuid] = useState();
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <authenticatedContext.Provider value={{authenticated,setAuthenticated}}>
      <mailContext.Provider value={{mail, setMail}}>  
      <uuidContext.Provider value={{uuid, setUuid}}>
        <BrowserRouter>
          <Routes>
            <Route element={<App/>} path='/'/>
            <Route element={<OtpScreen/>} path='/otp'/>
            <Route element={<Dashboard />} path='/dashboard'/>
          </Routes>
        </BrowserRouter>
      </uuidContext.Provider>
    </mailContext.Provider>
    </authenticatedContext.Provider>
  )
}
createRoot(document.getElementById('root')).render(
  <RenderApp/>
)

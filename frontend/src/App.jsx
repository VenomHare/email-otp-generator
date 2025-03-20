import React, { useContext, useEffect, useState } from 'react'
import { authenticatedContext, mailContext, uuidContext } from './context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINT, TOKEN } from './main';



const App = () => {

  const [loading, setLoading] = useState(false);

  const {mail, setMail} = useContext(mailContext);
  const {setUuid}= useContext(uuidContext);
  const {authenticated} = useContext(authenticatedContext)

  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated)
    {
      navigate("/dashboard");
    }
  }, [])
  

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const otpReq = await axios.post(
      `${ENDPOINT}/otp/generate`,
      { mail },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: TOKEN,
        },
      }
    );
    setLoading(false);
    if (otpReq.status == 200)
    {
      if (!otpReq.data.uuid)return;
      setUuid(otpReq.data.uuid);
      navigate("/otp");
    }
  }

  return (
    <div className='app'>

      <h1>Welcome Back!</h1>
      <form className="loginBlock" onSubmit={handleSendOtp}>
        {
          loading &&
          <div className='loading'>
            <div className='spinner'></div>
          </div>
        }
        <h2>Enter your Mail id to Login</h2>
        <input type="email" className="mailInput" required onChange={(e)=>{setMail(e.target.value);}} value={mail} />
        <button type="submit" className='sendOtpButton'>Send OTP</button>
      </form>
    </div>
  )
}

export default App
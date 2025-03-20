import React, { useContext, useEffect } from 'react'
import { authenticatedContext, mailContext } from '../context'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const {mail} = useContext(mailContext);
    const {authenticated, setAuthenticated} = useContext(authenticatedContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated)
        {   
            navigate("/");
        }
    }, [])
    

    return (
        <div className='dashboard'>
            <div className="info">  
                Successfully Logged In 🎉🎉
            </div>
            <div className="info">Email : {mail}</div>
            <button className="logoutBtn" onClick={()=>{setAuthenticated(false);navigate("/")}}>Logout</button>
        </div>
    )
}

export default Dashboard
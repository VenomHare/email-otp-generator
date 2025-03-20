import React, { useContext, useEffect, useRef, useState } from 'react'
import { authenticatedContext, mailContext, uuidContext } from '../context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINT, TOKEN } from '../main';
const Delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const OtpScreen = () => {
    const OTPLENGTH = 6;
    const iRef = useRef();
    const navigate = useNavigate();
    const { mail } = useContext(mailContext);
    const { uuid } = useContext(uuidContext);
    const { authenticated, setAuthenticated } = useContext(authenticatedContext)

    const [currentInput, setCurrentInput] = useState(0);
    const [errorText, setErrorText] = useState('');
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authenticated) {
            navigate("/dashboard");
        }
    }, [])


    const switchInput = async (id, value) => {
        setOtp(prev => { prev[id] = value; return prev });

        if (value !== "" && id != (OTPLENGTH - 1)) {
            setCurrentInput((prev) => prev + 1);
            await Delay(100)
            focus();
        }
    }
    const focus = () => {
        iRef.current?.focus();
    }

    const handleBackspace = async (e, id) => {
        if (e.target.value == "" && e.code == "Backspace" && currentInput !== 0) {
            setCurrentInput(prev => prev - 1);
            await Delay(100);
            setOtp(prev => {
                prev[id] = "";
                return prev;
            })
            iRef.current.value = "";
            focus();
        }
    }
    const verifyOtp = async () => {
        setErrorText("");
        const OTP = otp.join("");
        if (OTP.length !== OTPLENGTH) {
            setErrorText("Incomplete OTP");
        }
        setLoading(true);
        try {
            const otpReq = await axios.post(`${ENDPOINT}/otp/verify`, {
                otp: OTP,
                uuid
            }, {
                headers: {
                    'Content-Type': "application/json",
                    'authorization': TOKEN,
                },
            });
            setLoading(false);
            if (otpReq.status !== 200) {
                setErrorText(otpReq.data.message);
            }
            else {
                setAuthenticated(true);
                navigate("/dashboard");
            }
        }
        catch (err) {
            setLoading(false);
            setErrorText("Something went wrong.")
            console.log(err);
        }
    }

    const handlePaste = async (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        if (/^\d{6}$/.test(pastedText.trim())) {
            const newOtp = pastedText.trim().split("");
            setOtp(newOtp);
            for (let i = 0; i < OTPLENGTH; i++) {
                const inp = document.getElementById(i.toString());
                inp.value = newOtp[i];
            }
            setCurrentInput(OTPLENGTH-1)
        }

    }

    return (
        <div className='app'>
            <h1>Just One Last Step</h1>
            <div className="OtpScreen">
                {
                    loading &&
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                }
                <h2>Successfully Sent OTP to your mail</h2>
                <div className='mailBlock'>
                    <div className="blocked">{mail}</div>
                    <div className="changeMail" onClick={() => { navigate("/") }}>Change Mail</div>
                </div>
                {
                    errorText !== "" &&
                    <div className="errorText">{errorText} </div>
                }
                <div className="inputs">
                    <InputField id={0} handlePaste={handlePaste} currentInput={currentInput} switchInput={switchInput} iRef={iRef} handleBackspace={handleBackspace} focus={focus} />
                    <InputField id={1} handlePaste={handlePaste} currentInput={currentInput} switchInput={switchInput} iRef={iRef} handleBackspace={handleBackspace} focus={focus} />
                    <InputField id={2} handlePaste={handlePaste} currentInput={currentInput} switchInput={switchInput} iRef={iRef} handleBackspace={handleBackspace} focus={focus} />
                    <InputField id={3} handlePaste={handlePaste} currentInput={currentInput} switchInput={switchInput} iRef={iRef} handleBackspace={handleBackspace} focus={focus} />
                    <InputField id={4} handlePaste={handlePaste} currentInput={currentInput} switchInput={switchInput} iRef={iRef} handleBackspace={handleBackspace} focus={focus} />
                    <InputField id={5} handlePaste={handlePaste} currentInput={currentInput} switchInput={switchInput} iRef={iRef} handleBackspace={handleBackspace} focus={focus} />
                </div>
                <button className='verifyBtn' onClick={verifyOtp}>Verify</button>
            </div>
        </div>
    )
}

const InputField = ({ id, currentInput, switchInput, iRef, handlePaste, handleBackspace, focus }) => {
    return (
        <input
            type="number"
            className="single"
            id={id}
            ref={(currentInput == id) ? iRef : null}
            disabled={(currentInput != id)}
            onChange={(e) => { switchInput(id, e.target.value); }}
            min="0"
            max="9"
            onInput={(e) => {
                if (e.target.value < 0) e.target.value = 0;
                if (e.target.value > 9) e.target.value = 9;
            }}
            onKeyDown={(e) => handleBackspace(e, id)}
            onClick={focus}
            onPaste={handlePaste}
        />
    )
}

export default OtpScreen
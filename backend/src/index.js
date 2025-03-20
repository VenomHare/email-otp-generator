const crypto = require("crypto");
const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const digits = '0123456789'
const alpha = '123456789abcdefghijklmnopqrstuvwxyz'

const GOOGLE_MAIL = process.env.GOOGLE_MAIL;
const GOOGLE_PASS = process.env.GOOGLE_PASS;
const AUTHTOKEN = process.env.AUTHTOKEN;

if (!GOOGLE_MAIL || !GOOGLE_PASS) {
    throw new Error(".env Variables Not Found");
}


const generateOtp = (length) => {
    let password = ''
    while (password.length < length) {
        const charIndex = crypto.randomInt(0, digits.length)
        password += digits[charIndex]
    }
    return password
}
const generateUUID = () => {
    let password = ''
    while (password.length < 10) {
        const charIndex = crypto.randomInt(0, alpha.length)
        password += alpha[charIndex]
    }
    return password
}
const mailer = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: GOOGLE_MAIL,
        // Go to Account Settings, Search App Passwords in Security, Generate New App, Paste that password in .env
        pass: GOOGLE_PASS
    }
})

const activeOtps = []

const app = express();
app.use(cors())
app.use(express.json());
app.use((req, res, next) => {
    const { authorization } = req.headers;
    if (authorization == AUTHTOKEN) {
        next();
    }
    else {
        res.status(403).json({ message: "Unauthorized" }).end();
        return;
    }
})

app.post("/otp/generate", (req, res) => {
    const otp = generateOtp(6);
    const uuid = generateUUID();

    const { mail } = req.body;
    if (!mail) {
        res.status(404).json({ message: "Mail Not Found" }).end();
        return;
    }

    mailer.sendMail({
        from: "legendpuzzle147@gmail.com",
        to: mail,
        subject: "OTP for Login Verification",
        html: `<div><h1>OTP Login</h1><br/><h3>${otp} is your OTP for Login Verification</h3></div>`
    }, (error, emailResponse) => {
        if (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to send otp mail" }).end();
            return;
        }
        activeOtps.push({ otp, uuid })
        console.log(emailResponse);
        res.status(200).json({ uuid }).end();
        return;
    })
})

app.post("/otp/verify", (req, res) => {
    const { otp, uuid } = req.body;
    if (!otp || !uuid) {
        res.status(404).json({ message: "OTP or UUID not Found" }).end();
        return;
    }
    const otpObject = activeOtps.find((o) => o.uuid == uuid);
    console.log(otpObject, otp, uuid);
    if (!otpObject) {
        res.status(404).json({ message: "Invalid UUID" }).end();
        return;
    } 
    if (otpObject.otp == otp.toString()) {
        res.status(200).json({ message: "Otp Verified" }).end();
        return;
    }


    res.status(403).json({ message: "Invalid OTP" }).end();
    return;
})

app.listen(3010, () => {
    console.log("Backend is Up!!!");
})
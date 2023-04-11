import nodemailer from 'nodemailer'
import {google} from 'googleapis'
const { sign } = require("jsonwebtoken")

const secretKey = process.env.SECRET_JWT_KEY

const createToken = (payload) => {
    return sign(payload, secretKey)
}

const OAuth2 = google.auth.OAuth2;
    
const oauth2Client = new OAuth2(
    process.env.GOOGLE_API_CLIENT_ID, // ClientID
    process.env.GOOGLE_API_CLIENT_SECRET, // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN
});

var accessToken = oauth2Client.getAccessToken()

var transporter = nodemailer.createTransport({
    host: 'mail.askhandana.com',
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_EMAIL, 
        clientId: process.env.GOOGLE_API_CLIENT_ID,
        clientSecret: process.env.GOOGLE_API_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_API_REFRESH_TOKEN,
        accessToken: accessToken
    }
})

export default async function handler (req, res) {
    try {
        const {email} = req.body;
            
        const confirmationCode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)

        const mailOptions = {
            from: 'handana@askhandana.com',
            to: email,
            subject: 'HandanaAI Verification Email',
            text: `Your confirmation code is : ${confirmationCode}`
        }

        transporter.sendMail(mailOptions, async function(err, data) {

            if(err) {
                console.log('Error Occurs');
                res.status(401).json({code: 401, text: err})
            } else {
                const secret = await createToken({confirmationCode})
                res.status(200).json({text: 'Send confirmation code successfull, check your email', code: 200, secret})
            }
        })
    } catch(e) {
        console.log(e)
        res.status(500).json({
            text: 'Internal server error',
            code: 500
        })
    }
}
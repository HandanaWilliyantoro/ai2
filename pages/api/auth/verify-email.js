import { jwtVerify } from "jose";

const secretKey = process.env.SECRET_JWT_KEY

const verifyToken = async (token) => {
    return await jwtVerify(token, new TextEncoder().encode(secretKey)).payload;
}

export default async function handler (req, res) {
    try {
        const {secret, confirmationCode} = req.body;
        const token = await verifyToken(secret)
        if(token.confirmationCode === confirmationCode){
            res.status(200).json({
                text: 'Email verified!',
                code: 200
            })
        } else {
            res.status(404).json({
                text: 'Wrong verification code!',
                code: 404
            })
        }
    } catch(e) {
        console.log(e)
        res.status(500).json({
            text: 'Internal server error',
            code: 500
        })
    }
}
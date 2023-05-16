import dbConnect from "@/util/mongo";
import User from "@/models/User";
import { jwtVerify } from "jose";

const secretKey = process.env.SECRET_JWT_KEY

const verifyToken = async (token) => {
    try {
        return jwtVerify(token, new TextEncoder().encode(secretKey));
    } catch(e) {
        return "Please sign in to continue"
    }
}

export default async function handler (req, res) {
    try {
        await dbConnect()

        const {authorization} = req.headers;

        if(!authorization){
            throw new Error('You are not authorized to do this')
        }

        const parsedToken = await verifyToken(authorization)

        const {payload: {email}} = parsedToken;

        const data = await User.findOne({email});

        const iat = Math.floor(Date.now() / 1000);

        if(data.planExpiry && (iat >= data.planExpiry) && data.premium){
            await User.findByIdAndUpdate({_id: data._id}, {premium: false})
        }

        if(data){
            res.status(200).json({text: "Fetch profile success", code: 200, data})
        } else {
            throw new Error('Failed to fetch user profile')
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
} 
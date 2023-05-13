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

const basicPlanModel = async () => {
    const models = [
        {
            name: 'Epîc Diffusion 1.0 (general)',
            id: 'epic_diffusion_1'
        },
        {
            name: 'Anything 5.0 (anime)',
            id: 'anything_5_0'
        },
        {
            name: 'CyberRealistic 1.3 (realistic)',
            id: 'cyberrealistic_1_3'
        },
    ]
    return models
}

export default async function handler (req, res) {
    try {

        await dbConnect();

        const {authorization} = req.headers;

        if(!authorization){
            throw new Error('You are not authorized to do this')
        }

        const parsedToken = await verifyToken(authorization)

        const {payload: {email}} = parsedToken;

        const user = await User.findOne({email});

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_API_KEY,
                'X-RapidAPI-Host': 'dezgo.p.rapidapi.com'
            }
        };

        const data = await fetch('https://dezgo.p.rapidapi.com/info', options);

        const response = await data.json();

        const imageResponse = !user.premium ? await basicPlanModel() : await response.models;

        if(response && response.models){
            res.status(200).json({text: 'Fetch models success', code: 200, data: imageResponse})
        } else {
            res.status(401).json({text: 'Failed to fetch models', code: 401})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: e.message, code: 500})
    }
}
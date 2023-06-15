import { jwtVerify } from "jose";
import dbConnect from "@/util/mongo";
import UserApp from "@/models/UserApp";
import Plugin from "@/models/Plugin";
import App from "@/models/App";
import Webhook from "@/models/Webhook";

const secretKey = process.env.SECRET_JWT_KEY

const verifyToken = async (token) => {
    try {
        return jwtVerify(token, new TextEncoder().encode(secretKey));
    } catch(e) {
        return "Please sign in to continue"
    }
}

const fetchApps = async (type, email, filter) => {
    switch(type){
        case 'My Apps':
            return UserApp.find({email})
        case "Plugin":
            return Plugin.find()
        case "Application":
            return App.find();
        case "Webhook":
            return Webhook.find();
    }
}

export default async function handler (req, res) {
    try {

        await dbConnect();

        const {type} = req.body;
        const {authorization} = req.headers;

        if(!authorization){
            throw new Error('You are not authorized to do this')
        }

        const parsedToken = await verifyToken(authorization)

        const {payload: {email}} = parsedToken;

        const app = await fetchApps(type, email)

        if(app && app.length > 0){
            res.status(200).json({text: `Fetch ${type.toLowerCase()} success`, code: 200, data: app})
        } else {
            res.status(404).json({text: `Fetch ${type.toLowerCase()} failed`, code: 404})
        }
        
    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
}
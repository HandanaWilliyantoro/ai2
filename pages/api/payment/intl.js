import midtransClient from "midtrans-client"
import { jwtVerify } from "jose";
import {Types} from 'mongoose'
import ArtSubscription from "@/models/ArtSubscription";
import dbConnect from "@/util/mongo";
import User from "@/models/User";

const secretKey = process.env.SECRET_JWT_KEY


const verifyToken = async (token) => {
    try {
        return jwtVerify(token, new TextEncoder().encode(secretKey));
    } catch(e) {
        console.log(e.message)
        return "Please sign in to continue"
    }
}

let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction : process.env.MIDTRANS_PRODUCTION_ENV === "true" ? true : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY
});

export default async function handler(req, res) {
    try {

        await dbConnect()

        const {gross_amount} = req.body;
        const {authorization} = req.headers;

        const order_id = new Types.ObjectId()

        if(!authorization){
            throw new Error('You are not authorized to do this!')
        }

        const {payload: user} = await verifyToken(authorization)


        if(user){
            const userData = await User.findOne({email: user.email})
            const subscription = await new ArtSubscription({order_id, user_email: user.email, amount: gross_amount, channel_response_message: 'SUCCESS', currency: 'USD'})
            await subscription.save()
            if(subscription){
                await User.findOneAndUpdate({_id: userData._id}, {premium: true})
                res.status(200).json({text: 'create art subs success', code: 200, data: subscription});
            } else {
                res.status(404).json({text: 'Failed to create art subscription', code: 404})
            }
        } else {
            throw new Error('Failed to get transaction token')
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
}
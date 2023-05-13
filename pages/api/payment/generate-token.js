import midtransClient from "midtrans-client"
import { jwtVerify } from "jose";
import {Types} from 'mongoose'
import ArtSubscription from "@/models/ArtSubscription";
import dbConnect from "@/util/mongo";

const secretKey = process.env.SECRET_JWT_KEY

const verifyToken = async (token) => {
    return jwtVerify(token, new TextEncoder().encode(secretKey));
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

        let parameter = {
            "transaction_details": {
                order_id,
                gross_amount,
                "currency": "IDR"
            },
            "credit_card":{
                "secure" : true,
                "save_card": true
            },
            "customer_details": {
                "email": user.email,
            }
        };

        const response = await snap.createTransaction(parameter)

        if(response && response.token){
            const subscription = await new ArtSubscription({order_id, user_email: user.email, amount: gross_amount, channel_response_message: 'INITIATE', currency: 'IDR'})
            await subscription.save()
            if(subscription){
                res.status(200).json({text: 'Get token success', code: 200, data: response.token});
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
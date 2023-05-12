import midtransClient from "midtrans-client"
import { jwtVerify } from "jose";
import {Types} from 'mongoose'

console.log(process.env.MIDTRANS_PRODUCTION_ENV === "true" ? true : false, 'ini midtrans prod env')

const verifyToken = async (token) => {
    try {
        return jwtVerify(token, new TextEncoder().encode(secretKey));
    } catch(e) {
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
        const {gross_amount} = req.body;
        const {authorization} = req.headers;

        const order_id = new Types.ObjectId()

        if(!authorization){
            throw new Error('You are not authorized to do this!')
        }

        const user = await verifyToken(authorization)

        let parameter = {
            "transaction_details": {
                order_id,
                gross_amount
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
            res.status(200).json({text: 'Get token success', code: 200, data: response.token});
        } else {
            throw new Error('Failed to get transaction token')
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: 'Internal server error', code: 500, error: e.message})
    }
}
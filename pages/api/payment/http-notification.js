import User from '@/models/User';
import midtransClient from 'midtrans-client'
import dbConnect from '@/util/mongo';
import ArtSubscription from '@/models/ArtSubscription';

let snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_PRODUCTION_ENV === "true" ? true : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

export default async function handler (req, res) {
    try {

        await dbConnect()

        const {order_id, saved_token_id, payment_type, channel_response_message, saved_token_id_expired_at} = req.body;

        if(!order_id){
            throw new Error('Failed to handle http notification transaction');
        }

        const subscription = await ArtSubscription.findOne({order_id});

        const buyer = await User.findOne({email: subscription.user_email});

        if(saved_token_id && saved_token_id_expired_at){
            await User.findByIdAndUpdate({_id: buyer._id}, {saved_token_id, saved_token_id_expired_at})
        }

        if(buyer && subscription){
            await ArtSubscription.findByIdAndUpdate({_id: subscription._id}, {
                payment_type, 
                saved_token_id: saved_token_id || buyer.saved_token_id, 
                saved_token_id_expired_at: saved_token_id_expired_at || buyer.saved_token_id_expired_at,
                transaction_name: 'Art Generator Subscription',
                channel_response_message
            })
            const iat = Math.floor(Date.now() / 1000);
            await User.findByIdAndUpdate({_id: buyer._id}, {premium: true, planExpiry: iat + 2630000})
            res.status(200).json({text: 'Transaction successful', code: 200})
        } else {
            res.status(404).json({text: "failed to create subscription", code: 404})
        }

    } catch(e) {
        console.log(e.message)
        res.status(500).json({text: 'internal server error', code: 500, error: e.message})
    }
}
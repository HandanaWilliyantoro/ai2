import User from '@/models/User';
import midtransClient from 'midtrans-client'
import dbConnect from '@/util/mongo';
import ArtSubscription from '@/models/ArtSubscription';

let core = new midtransClient.CoreApi({
    isProduction: process.env.MIDTRANS_PRODUCTION_ENV === "true" ? true : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

export default async function handler (req, res) {
    try {

        await dbConnect()

        const {gross_amount, order_id, saved_token_id, currency, payment_type, channel_response_message, status_code, saved_token_id_expired_at} = req.body;

        if(status_code !== '200'){
            throw new Error('Failed to handle http notification transaction');
        }

        const subscription = await ArtSubscription.findOne({order_id});
        const buyer = await User.findOne({email: subscription.user_email});

        if(saved_token_id && saved_token_id_expired_at){
            await User.findByIdAndUpdate({_id: buyer._id}, {saved_token_id, saved_token_id_expired_at})
        }

        let parameter = {
            "name": "Art Generator Subscription",
            "amount": gross_amount,
            "currency": currency,
            "payment_type": payment_type,
            "token": saved_token_id || buyer.saved_token_id,
            "schedule": {
                "interval": 1,
                "interval_unit": "month",
                "max_interval": 12,
                "start_time": new Date()
            },
            "metadata": {
                "description": "Recurring payment for subscription art generator"
            },
            "customer_details": {
                "email": buyer.email,
            }
        };
        
        const subscriptionRes = await core.createSubscription(parameter);

        if(subscriptionRes){
            await ArtSubscription.findByIdAndUpdate({_id: subscription._id}, {
                payment_type, 
                saved_token_id: saved_token_id || buyer.saved_token_id, 
                saved_token_id_expired_at: saved_token_id_expired_at || buyer.saved_token_id_expired_at,
                transaction_name: 'Art Generator Subscription',
                channel_response_message
            })
            await User.findByIdAndUpdate({_id: buyer._id}, {premium: true})
            res.status(200).json({text: 'Subscription successful', code: 200})
        } else {
            res.status(404).json({text: "failed to create subscription", code: 404})
        }

    } catch(e) {
        console.log(e)
        res.status(500).json({text: e.message, code: 500})
    }
}
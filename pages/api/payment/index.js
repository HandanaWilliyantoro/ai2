import midtransClient from "midtrans-client";

// Create Core API instance
let core = new midtransClient.CoreApi({
    isProduction : process.env.MIDTRANS_PRODUCTION_ENV === "true" ? true : false,
    serverKey : process.env.MIDTRANS_SERVER_KEY,
    clientKey : process.env.MIDTRANS_CLIENT_KEY
});

export default async function handler (req, res) {
    try {

        const {payment_type} = req.body;

        let parameter = {
            "name": "test",
            "amount": "14000",
            "currency": "IDR",
            "payment_type": "credit_card",
            "token": "521111gmWqMegyejqCQmmopnCFRs1117",
            "schedule": {
              "interval": 1,
              "interval_unit": "month",
              "max_interval": 12,
              "start_time": "2021-11-25 07:25:01 +0700"
            },
            "metadata": {
              "description": "Recurring payment for A"
            },
            "customer_details": {
              "first_name": "John",
              "last_name": "Doe",
              "email": "johndoe@email.com",
              "phone": "+62812345678"
            }
        };
        
        // charge transaction
        const coreResponse = await core.createSubscription(parameter)

        res.status(200).json({text: 'test', data: coreResponse})
    } catch(e) {
        console.log(e)
        res.status(500).json({text: e.message, code: 500})
    }
}
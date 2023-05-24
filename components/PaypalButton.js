import {
    PayPalScriptProvider,
    PayPalButtons,
} from "@paypal/react-paypal-js";

function PaypalCheckoutButton({amount, handleIntlPayment}) {
    return (
        <PayPalScriptProvider options={{
            "client-id": process.env.PAYPAL_CLIENT_ID,
            currency: "USD",
            intent: "capture",
            "disable-funding": 'card'
        }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                    currency_code: 'USD'
                                },
                            },
                        ],
                        application_context: {
                            shipping_preference: 'NO_SHIPPING'
                        }
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        console.log(details, 'ini details')
                        handleIntlPayment()
                    });
                }}
            />
        </PayPalScriptProvider>
    );
}

export default PaypalCheckoutButton
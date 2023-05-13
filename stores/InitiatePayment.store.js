import {makeAutoObservable} from "mobx"

class InitiatePaymentStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(payload){
        initiatePayment.loading = true
        fetch(`/api/payment/generate-token`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': payload.accessToken
            },
            'body': JSON.stringify({gross_amount: payload.gross_amount})
        })
        .then(res => res.json())
        .then(response => {
            const {code, data} = response;
            if(code === 200){
                window.snap.pay(data, {
                    onSuccess: function(result){
                      /* You may add your own implementation here */
                      initiatePayment.success(response)
                    },
                    onPending: function(result){
                      /* You may add your own implementation here */
                      initiatePayment.failed("Payment Pending")
                    },
                    onError: function(result){
                      /* You may add your own implementation here */
                      initiatePayment.failed("Payment Error")
                    },
                    onClose: function(){
                      /* You may add your own implementation here */
                      initiatePayment.failed("Payment Pending")
                    },
                  })
            } else {
                initiatePayment.failed("Paymend Midtrans Error")
            }
        })
    }

    success(data){
        initiatePayment.response = data
        initiatePayment.error = undefined
        initiatePayment.loading = false
    }

    failed(data){
        initiatePayment.error = data;
        initiatePayment.loading = false;
        initiatePayment.response = undefined;
    }

    reset() {
        initiatePayment.response = undefined;
        initiatePayment.loading = false;
        initiatePayment.error = undefined
    }
}

const initiatePayment = new InitiatePaymentStore()

export default initiatePayment
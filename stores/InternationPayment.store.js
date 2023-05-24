import {makeAutoObservable} from "mobx"

class IntlPaymentStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(payload){
        intlPayment.loading = true
        fetch(`/api/payment/intl`, {
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
                intlPayment.success(data)
            } else {
                intlPayment.failed("Paymend Midtrans Error")
            }
        })
    }

    success(data){
        intlPayment.response = data
        intlPayment.error = undefined
        intlPayment.loading = false
    }

    failed(data){
        intlPayment.error = data;
        intlPayment.loading = false;
        intlPayment.response = undefined;
    }

    reset() {
        intlPayment.response = undefined;
        intlPayment.loading = false;
        intlPayment.error = undefined
    }
}

const intlPayment = new IntlPaymentStore()

export default intlPayment
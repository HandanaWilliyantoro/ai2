import {makeAutoObservable} from "mobx"

class DonateStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(payload){
        donate.loading = true
        fetch(`/api/donate`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'body': JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(response => {
            const {code, data} = response;
            if(code === 200){
                window.snap.pay(data.token, {
                    onSuccess: function(result){
                      /* You may add your own implementation here */
                      donate.success(response)
                    },
                    onPending: function(result){
                      /* You may add your own implementation here */
                      donate.failed("Payment Pending")
                    },
                    onError: function(result){
                      /* You may add your own implementation here */
                      donate.failed("Payment Error")
                    },
                    onClose: function(){
                      /* You may add your own implementation here */
                      donate.failed("Payment Pending")
                    }
                  })
            } else {
                donate.failed("Paymend Midtrans Error")
            }
        })
    }

    success(data){
        donate.response = data
        donate.error = undefined
        donate.loading = false
    }

    failed(data){
        donate.error = data;
        donate.loading = false;
        donate.response = undefined;
    }

    reset() {
        donate.response = undefined;
        donate.loading = false;
        donate.error = undefined
    }
}

const donate = new DonateStore()

export default donate
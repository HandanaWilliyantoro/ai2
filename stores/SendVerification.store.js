import {makeAutoObservable} from "mobx"

class PostSendVerificationStore {
    response = undefined;
    error = undefined;
    loading = false
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(params){
        sendVerification.loading = true
        fetch(`/api/auth/send-verification`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'body': JSON.stringify(params)
        })
        .then(res => res.json())
        .then(response => {
            if(response.code === 200){
                sendVerification.success(response)
            } else {
                sendVerification.failed(response.text)
            }
        })
        .catch(e => sendVerification.failed(e))
    }

    success(data){
        sendVerification.response = data
        sendVerification.error = undefined
        sendVerification.loading = false
    }

    failed(data){
        sendVerification.error = data;
        sendVerification.loading = false;
        sendVerification.response = undefined;
    }

    reset() {
        sendVerification.response = undefined;
        sendVerification.loading = false;
        sendVerification.error = undefined
    }
}

const sendVerification = new PostSendVerificationStore()

export default sendVerification
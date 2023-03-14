import {makeAutoObservable} from "mobx"

class PostVerifyEmailStore {
    response = undefined;
    error = undefined;
    loading = false
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(params){
        verifyEmail.loading = true
        fetch(`/api/auth/verify-email`, {
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
                verifyEmail.success(response)
            } else {
                verifyEmail.failed(response.text)
            }
        })
        .catch(e => verifyEmail.failed(e))
    }

    success(data){
        verifyEmail.response = data
        verifyEmail.error = undefined
        verifyEmail.loading = false
    }

    failed(data){
        verifyEmail.error = data;
        verifyEmail.loading = false;
        verifyEmail.response = undefined;
    }

    reset() {
        verifyEmail.response = undefined;
        verifyEmail.loading = false;
        verifyEmail.error = undefined
    }
}

const verifyEmail = new PostVerifyEmailStore()

export default verifyEmail
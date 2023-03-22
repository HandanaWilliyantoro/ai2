import {makeAutoObservable} from "mobx"

class PostSignUpStore {
    response = undefined;
    error = undefined;
    loading = false
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(params){
        signUp.loading = true
        fetch(`/api/auth/sign-up`, {
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
                signUp.success(response.data)
            } else {
                signUp.failed(response.text)
            }
        })
        .catch(e => signUp.failed(e))
    }

    success(data){
        signUp.response = data
        signUp.error = undefined
        signUp.loading = false
    }

    failed(data){
        signUp.error = data;
        signUp.loading = false;
        signUp.response = undefined;
    }

    reset() {
        signUp.response = undefined;
        signUp.loading = false;
        signUp.error = undefined
    }
}

const signUp = new PostSignUpStore()

export default signUp
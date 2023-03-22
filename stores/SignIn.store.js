import {makeAutoObservable} from "mobx"

class PostSignInStore {
    response = undefined;
    error = undefined;
    loading = false
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(params){
        signIn.loading = true
        fetch(`/api/auth/sign-in`, {
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
                signIn.success(response.data)
            } else {
                signIn.failed(response.text)
            }
        })
        .catch(e => signIn.failed(e))
    }

    success(data){
        signIn.response = data
        signIn.error = undefined
        signIn.loading = false
    }

    failed(data){
        signIn.error = data;
        signIn.loading = false;
        signIn.response = undefined;
    }

    reset() {
        signIn.response = undefined;
        signIn.loading = false;
        signIn.error = undefined
    }
}

const signIn = new PostSignInStore()

export default signIn
import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

class CodeStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        postCode.loading = true
        fetch(`/api/code`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            'body': JSON.stringify(params)
        }).then(res => res.json())
        .then(response => {
            if(response.data){
                postCode.success(response.data)
            } else {
                postCode.failed(response.text)
            }
        })
        .catch(e => postCode.failed(e))
    }

    success(data, premium){
        getProfile.premium = premium;
        postCode.response = data
        postCode.error = undefined
        postCode.loading = false
    }

    failed(data){
        postCode.error = data;
        postCode.loading = false;
        postCode.response = "";
    }

    reset() {
        postCode.response = "";
        postCode.loading = false;
        postCode.error = undefined
        postCode.finished = false;
    }
}

const postCode = new CodeStore()

export default postCode
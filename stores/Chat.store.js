import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

class ChatStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        postChat.loading = true
        fetch(`/api/chat`, {
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
                postChat.success(response.data)
            } else {
                postChat.failed(response.text)
            }
        })
        .catch(e => postChat.failed(e))
    }

    success(data, premium){
        getProfile.premium = premium;
        postChat.response = data
        postChat.error = undefined
        postChat.loading = false
        postChat.finished = true;
    }

    failed(data){
        postChat.error = data;
        postChat.loading = false;
        postChat.finished = true;
        postChat.response = "";
    }

    reset() {
        postChat.response = "";
        postChat.loading = false;
        postChat.error = undefined
        postChat.finished = false;
    }
}

const postChat = new ChatStore()

export default postChat
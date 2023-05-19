import {makeAutoObservable} from "mobx"

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
        const token = localStorage.getItem('token')
        fetch(`/api/chat`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': token
            },
            'body': JSON.stringify(params)
        }).then(res => res.json())
        .then(response => {
            if(response.data){
                postChat.success({data: response.data, conversationId: response.data.conversationId})
            } else {
                postChat.failed(response.text)
            }
        })
        .catch(e => postChat.failed(e))
    }

    success(data, premium){
        postChat.response = data
        postChat.error = undefined
        postChat.loading = false
    }

    failed(data){
        postChat.error = data;
        postChat.loading = false;
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
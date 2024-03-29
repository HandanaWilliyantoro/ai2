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
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': token
            },
            'body': JSON.stringify(params)
        }).then(res => {
            const reader = res.body.getReader();

            const read = () => {
            // read the data
            reader.read().then(async ({ done, value }) => {
                const decoder = new TextDecoder();
                if (done) {
                    postChat.finished = true;
                    return;
                }
                if(decoder.decode(value) === 'initiate | stop'){
                    return;
                } else {
                    const decoded = decoder.decode(value);
                    postChat.success(decoded)
                }
                read();
            });
            };
            read();
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
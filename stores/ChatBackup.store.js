import {makeAutoObservable} from "mobx"

class ChatBackupStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        postChatBackup.loading = true
        fetch(`/api/chat/backup`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            'body': JSON.stringify(params)
        }).then(res => {
            const reader = res.body.getReader();

            const read = () => {
            // read the data
            reader.read().then(async ({ done, value }) => {
                const decoder = new TextDecoder();
                if (done) {
                    postChatBackup.finished = true;
                    return;
                }
                if(decoder.decode(value) === 'initiate | stop'){
                    console.log('initiate | stop')
                    return;
                } else {
                    const decoded = decoder.decode(value);
                    postChatBackup.success(decoded)
                }
                read();
            });
            };
            read();
        })
        .catch(e => postChatBackup.failed(e))
    }

    success(data, premium){
        postChatBackup.response = data
        postChatBackup.error = undefined
        postChatBackup.loading = false
    }

    failed(data){
        postChatBackup.error = data;
        postChatBackup.loading = false;
        postChatBackup.response = "";
    }

    reset() {
        postChatBackup.response = "";
        postChatBackup.loading = false;
        postChatBackup.error = undefined
        postChatBackup.finished = false;
    }
}

const postChatBackup = new ChatBackupStore()

export default postChatBackup
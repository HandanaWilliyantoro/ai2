import {makeAutoObservable} from "mobx"

class PluginAnswerStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        postPluginAnswer.loading = true
        fetch(`/api/chat/plugins`, {
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
                    postPluginAnswer.finished = true;
                    return;
                }
                if(decoder.decode(value) === 'initiate | stop'){
                    console.log('initiate | stop')
                    return;
                } else {
                    const decoded = decoder.decode(value);
                    postPluginAnswer.success(decoded)
                }
                read();
            });
            };
            read();
        })
        .catch(e => postPluginAnswer.failed(e))
    }

    success(data, premium){
        postPluginAnswer.response = data
        postPluginAnswer.error = undefined
        postPluginAnswer.loading = false
    }

    failed(data){
        postPluginAnswer.error = data;
        postPluginAnswer.loading = false;
        postPluginAnswer.response = "";
    }

    reset() {
        postPluginAnswer.response = "";
        postPluginAnswer.loading = false;
        postPluginAnswer.error = undefined
        postPluginAnswer.finished = false;
    }
}

const postPluginAnswer = new PluginAnswerStore()

export default postPluginAnswer
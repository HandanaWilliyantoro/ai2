import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

async function parseGPTResponse(formattedString) {
    const dataChunks = await formattedString.split("data:");
    const responseObjectText = await dataChunks[dataChunks.length - 1].trim();
    const checkResponse = await responseObjectText 
    && responseObjectText.includes('{"content":') 
    && !responseObjectText.includes('"role":"assistant"') 
    && !responseObjectText.includes('[DONE]') 
    && !responseObjectText.includes('"finish_reason":"stop"')
    && !responseObjectText.includes('"type": "invalid_request_error",')
    ? true : false
    if(checkResponse){
        const responseObject = await JSON.parse(responseObjectText);
        const checkResponseObj = await responseObject && responseObject.choices && responseObject.choices.length > 0 && responseObject.choices[0] ? true : false
        if(checkResponseObj){
            return responseObject.choices[0].delta.content;
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

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
        fetch(`/api/chat?history=${JSON.stringify(params)}`, {
            'method': "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
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
                    console.log('initiate | stop')
                    return;
                } else {
                    const decoded = await decoder.decode(value);
                    const line = await parseGPTResponse(decoded)
                    postChat.success(line)
                }
                read();
            });
            };
            read();
        })
        .catch(e => postChat.failed(e))
    }

    success(data, premium){
        getProfile.premium = premium;
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
import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

async function parseGPTResponse(formattedString) {
    const dataChunks = formattedString.split("data:");
    const responseObjectText = dataChunks[dataChunks.length - 1].trim();
    if(responseObjectText
        && !responseObjectText.includes('"role":"assistant"') 
        && !responseObjectText.includes('[DONE]') 
        && !responseObjectText.includes('"finish_reason":"stop"')
        && !responseObjectText.includes('"type": "invalid_request_error",')
    ){
        const responseObject = await JSON.parse(responseObjectText);

        if(responseObject && responseObject.choices && responseObject.choices.length > 0 && responseObject.choices[0]){
            return responseObject.choices[0].delta.content;
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}

class SummarizerStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        summarizer.loading = true
        fetch(`/api/tldr?q=${params.q}&summaryContent=${JSON.stringify(params.summaryContent)}`, {
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
                    summarizer.finished = true;
                    return;
                }
                if(decoder.decode(value) === 'initiate | stop'){
                    console.log('initiate | stop')
                } else {
                    const decoded = decoder.decode(value);
                    const line = await parseGPTResponse(decoded)
                    summarizer.success(line)
                }
                read();
            });
            };
            read();
        })
        .catch(e => summarizer.failed(e))
    }

    success(data, premium){
        getProfile.premium = premium;
        summarizer.response = data
        summarizer.error = undefined
        summarizer.loading = false
    }

    failed(data){
        summarizer.error = data;
        summarizer.loading = false;
        summarizer.response = "";
    }

    reset() {
        summarizer.response = "";
        summarizer.loading = false;
        summarizer.error = undefined
        summarizer.finished = false;
    }
}

const summarizer = new SummarizerStore()

export default summarizer
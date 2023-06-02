import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

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
        fetch(`/api/tldr/backup`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            'body': JSON.stringify(params)
        })
        .then(res => res.json())
        .then(response => {
            if(response.data){
                summarizer.success(response.data)
            } else {
                summarizer.failed(response.text)
            }
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
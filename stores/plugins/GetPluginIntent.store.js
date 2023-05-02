import {makeAutoObservable} from "mobx"

class GetPluginIntentStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        getPluginIntents.loading = true
        fetch(`/api/chat/plugins/get-intents`, {
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
                getPluginIntents.success(response.data)
            } else {
                getPluginIntents.failed(response.text)
            }
        })
        .catch(e => getPluginIntents.failed(e))
    }

    success(data){
        getPluginIntents.response = data
        getPluginIntents.error = undefined
        getPluginIntents.loading = false
    }

    failed(data){
        getPluginIntents.error = data;
        getPluginIntents.loading = false;
        getPluginIntents.response = "";
    }

    reset() {
        getPluginIntents.response = "";
        getPluginIntents.loading = false;
        getPluginIntents.error = undefined
        getPluginIntents.finished = false;
    }
}

const getPluginIntents = new GetPluginIntentStore()

export default getPluginIntents
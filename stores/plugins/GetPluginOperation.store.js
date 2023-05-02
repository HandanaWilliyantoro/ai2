import {makeAutoObservable} from "mobx"

class GetPluginOperationStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        getPluginOperation.loading = true
        fetch(`/api/chat/plugins/get-operation`, {
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
                getPluginOperation.success(response.data)
            } else {
                getPluginOperation.failed(response.text)
            }
        })
        .catch(e => getPluginOperation.failed(e))
    }

    success(data){
        getPluginOperation.response = data
        getPluginOperation.error = undefined
        getPluginOperation.loading = false
    }

    failed(data){
        getPluginOperation.error = data;
        getPluginOperation.loading = false;
        getPluginOperation.response = "";
    }

    reset() {
        getPluginOperation.response = "";
        getPluginOperation.loading = false;
        getPluginOperation.error = undefined
        getPluginOperation.finished = false;
    }
}

const getPluginOperation = new GetPluginOperationStore()

export default getPluginOperation
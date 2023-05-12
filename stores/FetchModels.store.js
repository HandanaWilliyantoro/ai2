import {makeAutoObservable} from "mobx"

class FetchModelStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute({accessToken}){
        getModels.loading = true
        const token = localStorage.getItem('token')
        fetch(`/api/art/model`, {
            'method': "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': accessToken ? accessToken : token
            },
        })
        .then(res => res.json())
        .then(response => {
            if(response.data){
                getModels.success(response.data)
            } else {
                getModels.failed(response.text)
            }
        })
        .catch(e => getModels.failed(e))
    }

    success(data){
        getModels.response = data
        getModels.error = undefined
        getModels.loading = false
    }

    failed(data){
        getModels.error = data;
        getModels.loading = false;
        getModels.response = "";
    }

    reset() {
        getModels.response = "";
        getModels.loading = false;
        getModels.error = undefined
        getModels.finished = false;
    }
}

const getModels = new FetchModelStore()

export default getModels
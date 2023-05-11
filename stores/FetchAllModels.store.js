import {makeAutoObservable} from "mobx"

class FetchAllModelStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute({session}){
        getAllModels.loading = true
        const token = localStorage.getItem('token')
        fetch(`/api/art/model/all`, {
            'method': "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': session?.accessToken ? session?.accessToken : token
            },
        })
        .then(res => res.json())
        .then(response => {
            if(response.data){
                getAllModels.success(response.data)
            } else {
                getAllModels.failed(response.text)
            }
        })
        .catch(e => getAllModels.failed(e))
    }

    success(data){
        getAllModels.response = data
        getAllModels.error = undefined
        getAllModels.loading = false
    }

    failed(data){
        getAllModels.error = data;
        getAllModels.loading = false;
        getAllModels.response = "";
    }

    reset() {
        getAllModels.response = "";
        getAllModels.loading = false;
        getAllModels.error = undefined
        getAllModels.finished = false;
    }
}

const getAllModels = new FetchAllModelStore()

export default getAllModels
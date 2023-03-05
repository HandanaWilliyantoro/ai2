import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

class GetSearchStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        getSearch.loading = true
        fetch(`/api/search`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(params)
        })
        .then(res => res.json())
        .then((response) => {
            if(response.summaryContent.length > 0){
                getSearch.success(response)
            } else {
                getSearch.failed(response.text)
            }
        })
        .catch(e => getSearch.failed(e))
    }
    
    success(data){
        getSearch.response = data
        getSearch.error = undefined
        getSearch.loading = false
    }

    failed(data){
        getSearch.error = data;
        getSearch.loading = false;
        getSearch.response = "";
    }

    reset() {
        getSearch.response = "";
        getSearch.loading = false;
        getSearch.error = undefined
    }
}

const getSearch = new GetSearchStore()

export default getSearch
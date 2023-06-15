import {makeAutoObservable} from "mobx"

class FetchMarketplaceContentStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute({accessToken, type}){
        getMarketContent.loading = true
        const token = localStorage.getItem('token')
        fetch(`/api/marketplace`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': accessToken ? accessToken : token
            },
            'body': JSON.stringify({type})
        })
        .then(res => res.json())
        .then(response => {
            if(response.data){
                getMarketContent.success(response.data)
            } else {
                getMarketContent.failed(response.text)
            }
        })
        .catch(e => getMarketContent.failed(e))
    }

    success(data){
        getMarketContent.response = data
        getMarketContent.error = undefined
        getMarketContent.loading = false
    }

    failed(data){
        getMarketContent.error = data;
        getMarketContent.loading = false;
        getMarketContent.response = "";
    }

    reset() {
        getMarketContent.response = "";
        getMarketContent.loading = false;
        getMarketContent.error = undefined
        getMarketContent.finished = false;
    }
}

const getMarketContent = new FetchMarketplaceContentStore()

export default getMarketContent
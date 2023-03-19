import {makeAutoObservable} from "mobx"

class ArtStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        createArt.loading = true
        fetch(`/api/art`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(params)
        })
        .then(res => res.json())
        .then((response) => {
            if(response.data){
                createArt.success(response.data)
            } else {
                createArt.failed(response.text)
            }
        })
        .catch(e => createArt.failed(e))
    }
    
    success(data){
        createArt.response = data
        createArt.error = undefined
        createArt.loading = false
    }

    failed(data){
        createArt.error = data;
        createArt.loading = false;
        createArt.response = "";
    }

    reset() {
        createArt.response = "";
        createArt.loading = false;
        createArt.error = undefined
    }
}

const createArt = new ArtStore()

export default createArt
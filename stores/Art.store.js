import {makeAutoObservable} from "mobx"
import limitation from "@/util/limitation";

class ArtStore {
    response = undefined;
    error = undefined;
    loading = false;
    text = undefined
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        createArt.loading = true
        const token = localStorage.getItem('token')
        const limitedAccess = await limitation(params.premium)
        if(limitedAccess.code === 200){
            delete params.premium
            fetch(`/api/art`, {
                'method': "POST",
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                'body': JSON.stringify(params)
            })
            .then(res => res.json())
            .then((response) => {
                if(response.data){
                    createArt.success(response.data, limitedAccess.text)
                } else {
                    createArt.failed(response.text)
                }
            })
            .catch(error => {
                console.log(error.e)
                createArt.failed('internal server error')
            })
        } else {
            createArt.failed("We're at maximum capacity at this moment")
        }
    }
    
    success(data, text){
        createArt.response = data
        createArt.text = text
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
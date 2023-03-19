import {makeAutoObservable} from "mobx"

class ImageStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        findImage.loading = true
        fetch(`/api/image`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(params)
        })
        .then(res => res.json())
        .then((response) => {
            if(response.data.length > 0){
                findImage.success(response.data)
            } else {
                findImage.failed(response.text)
            }
        })
        .catch(e => findImage.failed(e))
    }
    
    success(data){
        findImage.response = data
        findImage.error = undefined
        findImage.loading = false
    }

    failed(data){
        findImage.error = data;
        findImage.loading = false;
        findImage.response = "";
    }

    reset() {
        findImage.response = "";
        findImage.loading = false;
        findImage.error = undefined
    }
}

const findImage = new ImageStore()

export default findImage
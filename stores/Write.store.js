import {makeAutoObservable} from "mobx"

class WriteStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        postWrite.loading = true
        fetch(`/api/answer`, {
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
        .then((response) => {
            if(response.code === 200){
                postWrite.success(response.data)
            } else {
                postWrite.failed(response.text)
            }
        })
        .catch(e => postWrite.failed(e))
    }

    success(data){
        postWrite.response = data
        postWrite.error = undefined
        postWrite.loading = false
    }

    failed(data){
        postWrite.error = data;
        postWrite.loading = false;
        postWrite.response = "";
    }

    reset() {
        postWrite.response = "";
        postWrite.loading = false;
        postWrite.error = undefined
        postWrite.finished = false;
    }
}

const postWrite = new WriteStore()

export default postWrite
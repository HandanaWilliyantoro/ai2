import {makeAutoObservable} from "mobx"

class GetProfileStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    execute({accessToken}){
        getProfile.loading = true
        fetch(`/api/me`, {
            'method': "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': accessToken
            },
        })
        .then(res => res.json())
        .then(response => {
            if(response.code && response.code === 200){
                getProfile.success(response.data)
            } else {
                getProfile.failed(response.text)
            }
        })
        .catch(e => getProfile.failed(e))
    }

    success(data){
        getProfile.response = data
        getProfile.error = undefined
        getProfile.loading = false
    }

    failed(data){
        getProfile.error = data;
        getProfile.loading = false;
        getProfile.response = undefined;
    }

    reset() {
        getProfile.response = undefined;
        getProfile.loading = false;
        getProfile.error = undefined
    }
}

const getProfile = new GetProfileStore()

export default getProfile
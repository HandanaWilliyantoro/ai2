import {makeAutoObservable} from "mobx"

class GetProfileStore {
    response = undefined;
    error = undefined;
    loading = false;
    premium = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    execute(params){
        getProfile.loading = true
        const token = localStorage.getItem('token')
        fetch(`/user/me`, {
            'method': "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(res => res.json())
        .then(response => {
            if(response.code && response.code === 200){
                getProfile.success(response.data, response.premium)
            } else {
                getProfile.failed(response.text)
            }
        })
        .catch(e => getProfile.failed(e))
    }

    success(data, premium){
        getProfile.premium = premium
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
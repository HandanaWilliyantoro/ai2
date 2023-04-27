import {makeAutoObservable} from "mobx"

class FetchDonationStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(){
        getDonations.loading = true
        fetch(`/api/donate/all`, {
            'method': "GET",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
        })
        .then(res => res.json())
        .then(response => {
            if(response.data){
                getDonations.success(response.data)
            } else {
                getDonations.failed(response.text)
            }
        })
        .catch(e => getDonations.failed(e))
    }

    success(data){
        getDonations.response = data
        getDonations.error = undefined
        getDonations.loading = false
    }

    failed(data){
        getDonations.error = data;
        getDonations.loading = false;
        getDonations.response = "";
    }

    reset() {
        getDonations.response = "";
        getDonations.loading = false;
        getDonations.error = undefined
        getDonations.finished = false;
    }
}

const getDonations = new FetchDonationStore()

export default getDonations
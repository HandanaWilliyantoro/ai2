import {makeAutoObservable} from "mobx"
import getProfile from "./Profile.store";

class SummarizerBackupStore {
    response = "";
    error = undefined;
    loading = false;
    finished = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        summarizerBackup.loading = true
        fetch(`/api/tldr/backup`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            'body': JSON.stringify(params)
        }).then(res => {
            const reader = res.body.getReader();

            const read = () => {
            // read the data
            reader.read().then(async ({ done, value }) => {
                const decoder = new TextDecoder();

                if (done) {
                    summarizerBackup.finished = true;
                    return;
                }
                if(decoder.decode(value) === 'initiate | stop'){
                } else {
                    const decoded = decoder.decode(value);
                    summarizerBackup.success(decoded)
                }
                read();
            });
            };
            read();
        })
        .catch(e => summarizerBackup.failed(e))
    }

    success(data, premium){
        getProfile.premium = premium;
        summarizerBackup.response = data
        summarizerBackup.error = undefined
        summarizerBackup.loading = false
    }

    failed(data){
        summarizerBackup.error = data;
        summarizerBackup.loading = false;
        summarizerBackup.response = "";
    }

    reset() {
        summarizerBackup.response = "";
        summarizerBackup.loading = false;
        summarizerBackup.error = undefined
        summarizerBackup.finished = false;
    }
}

const summarizerBackup = new SummarizerBackupStore()

export default summarizerBackup

import {makeAutoObservable} from "mobx"

class StockImageStore {
    response = undefined;
    error = undefined;
    loading = false;
    
    constructor(){
        makeAutoObservable(this)
    }

    async execute(params){
        findStockImage.loading = true
        fetch(`/api/stock-image`, {
            'method': "POST",
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify(params)
        })
        .then(res => res.json())
        .then((response) => {
            if(response.data.length > 0){
                findStockImage.success(response.data)
            } else {
                findStockImage.failed(response.text)
            }
        })
        .catch(e => findStockImage.failed(e))
    }
    
    success(data){
        findStockImage.response = data
        findStockImage.error = undefined
        findStockImage.loading = false
    }

    failed(data){
        findStockImage.error = data;
        findStockImage.loading = false;
        findStockImage.response = "";
    }

    reset() {
        findStockImage.response = "";
        findStockImage.loading = false;
        findStockImage.error = undefined
    }
}

const findStockImage = new StockImageStore()

export default findStockImage
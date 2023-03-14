import {toast} from 'react-toastify'

const showSuccessSnackbar = (msg) => {
    toast.success(msg, {
        position: toast.POSITION.TOP_CENTER
    });
};

const showErrorSnackbar = (msg) => {
    toast.error(msg, {
        position: toast.POSITION.TOP_CENTER
    })
}

export {
    showSuccessSnackbar,
    showErrorSnackbar
}
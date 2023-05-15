const authenticate = async (user, token) => {
    try {
        const expiry = localStorage.getItem('expiry')
        if(expiry){
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token)
        }
        return;
    } catch(e) {
        return e
    }
}

export {
    authenticate
}
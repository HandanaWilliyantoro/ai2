const authenticate = async (user, token) => {
    try {
        await localStorage.setItem('user', JSON.stringify(user));
        await localStorage.setItem('token', token)
        return;
    } catch(e) {
        return e
    }
}

export {
    authenticate
}
const authenticate = async (user, token) => {
    try {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token)
        return;
    } catch(e) {
        return e
    }
}

export {
    authenticate
}
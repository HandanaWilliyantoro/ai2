const limitation = async (premium) => {
    if(premium){
        localStorage.removeItem('art-limit')
        localStorage.removeItem('art-session')
        return {code: 200, text: 'Continue using premium'}
    } else {
        const token = localStorage.getItem('token');
        if(token){
            return {code: 200, text: 'Continue'}
        } else {
            return {text: 'Sign in to continue', code: 401}
        }
    }
}

export default limitation
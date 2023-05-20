const limitation = async (premium) => {
    if(premium){
        localStorage.removeItem('art-limit')
        localStorage.removeItem('art-session')
        return {code: 200, text: 'Continue using premium'}
    } else {
        const token = localStorage.getItem('token');
        if(token){
            const currentDate = Date.parse(new Date());
            const sessionDate = localStorage.getItem('art-session');
            const currentLimit = localStorage.getItem('art-limit');
            if (Number(currentLimit) > 0) {
                localStorage.setItem('art-limit', Number(currentLimit) - 1)
                return {code: 200, text: 'Continue'}
            } else {
                if(Number(currentDate) >= Number(sessionDate) ){
                    const newLimit = Math.floor(Math.random() * 6) + 10;
                    localStorage.setItem('art-session', currentDate + 1800000)
                    localStorage.setItem('art-limit', newLimit);
                    return {code: 200, text: 'Continue'}
                } else {
                    return {code: 404, text: 'At capacity'}
                }
            }
        } else {
            return {text: 'Sign in to continue', code: 401}
        }
    }
}

export default limitation
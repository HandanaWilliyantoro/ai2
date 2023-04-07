const limitation = async (premium) => {
    if(premium){
        await localStorage.removeItem('limit')
        await localStorage.removeItem('session')
        return {code: 200, text: 'Continue'}
    } else {
        const token = localStorage.getItem('token');
        if(token){
            const currentDate = Date.parse(new Date());
            const sessionDate = localStorage.getItem('session');
            const currentLimit = localStorage.getItem('limit');
            if (Number(currentLimit) > 0) {
                await localStorage.setItem('limit', Number(currentLimit) - 1)
                return {code: 200, text: 'Continue'}
            } else {
                if(Number(currentDate) >= Number(sessionDate) ){
                    const newLimit = Math.ceil(Math.random() * 5);
                    await localStorage.setItem('session', currentDate + 1800000)
                    await localStorage.setItem('limit', newLimit);
                    return {code: 200, text: 'Continue'}
                } else {
                    return {code: 404, text: 'Handana AI is at capacity right now, we kindly ask that you return later'}
                }
            }
        } else {
            return {text: 'You are not authorized to do this', code: 401}
        }
    }
}

export default limitation
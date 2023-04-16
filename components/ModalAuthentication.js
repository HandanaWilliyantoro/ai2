import React, { useCallback, useState } from 'react'
import ModalSignIn from './ModalSignIn';
import ModalSignUp from './ModalSignUp';
import ModalVerifyCode from './ModalVerifyCode';

const ModalAuthentication = ({setIsAuthenticated}) => {
    
    const [modalType, setModalType] = useState('sign-in');
    const [secret, setSecret] = useState('')
    const [userData, setUserData] = useState({})

    const renderBody = useCallback((type) => {
        switch(type){
            case 'sign-up':
                return <ModalSignUp setIsAuthenticated={setIsAuthenticated} onRequestClose={() => setIsAuthenticated(undefined)} userData={userData} setUserData={setUserData} setSecret={setSecret} setModalType={setModalType} isOpen={type === 'sign-up'} />
            case 'sign-in': 
                return <ModalSignIn setIsAuthenticated={setIsAuthenticated} onRequestClose={() => setIsAuthenticated(undefined)} setModalType={setModalType} isOpen={type === 'sign-in'} />
            case 'verify':
                return <ModalVerifyCode setIsAuthenticated={setIsAuthenticated} onRequestClose={() => setIsAuthenticated(undefined)} secret={secret} setModalType={setModalType} userData={userData} isOpen={type === 'verify'} />
            default:
                return;
        }
    }, [secret, userData]);

    return renderBody(modalType)
}

export default ModalAuthentication
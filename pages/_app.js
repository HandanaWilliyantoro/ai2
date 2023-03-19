import React, {useCallback, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { ToastContainer } from 'react-toastify';

import ModalSignIn from '@/components/ModalSignIn';
import ModalSignUp from '@/components/ModalSignUp';
import ModalVerifyCode from '@/components/ModalVerifyCode';

/* Store */
import signIn from '@/stores/SignIn.store';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'
import { showErrorSnackbar, showSuccessSnackbar } from '@/util/toast';

const App = ({ Component, pageProps }) => {

  const [modalType, setModalType] = useState('verify');
  const [secret, setSecret] = useState('')
  const [userData, setUserData] = useState({})

  //#region HANDLER
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if(isLoggedIn !== null){
      setModalType(undefined);
    }
  }, [])

  const renderModalAuth = useCallback((type) => {
    switch(type){
      case 'sign-up':
        return <ModalSignUp setUserData={setUserData} setSecret={setSecret} setModalType={setModalType} isOpen={type === 'sign-up'} />
      case 'sign-in': 
        return <ModalSignIn setModalType={setModalType} isOpen={type === 'sign-in'} />
      case 'verify':
        return <ModalVerifyCode secret={secret} setModalType={setModalType} userData={userData} isOpen={type === 'verify'} />
      default:
        return;
    }
  }, [secret, userData]);
  //#endregion

  return (
    <>
      {renderModalAuth(modalType)}
      <ToastContainer autoClose={8000} />
      <Component {...pageProps} />
    </>
  )
}

export default App
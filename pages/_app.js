import React, {useCallback, useEffect, useState, useMemo} from 'react';
import { observer } from 'mobx-react-lite';
import { ToastContainer } from 'react-toastify';

import ModalSignIn from '@/components/ModalSignIn';
import ModalSignUp from '@/components/ModalSignUp';
import ModalVerifyCode from '@/components/ModalVerifyCode';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';

const App = ({ Component, pageProps }) => {
  const [modalType, setModalType] = useState('sign-up');
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
        return <ModalSignUp userData={userData} setUserData={setUserData} setSecret={setSecret} setModalType={setModalType} isOpen={type === 'sign-up'} />
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
    <SessionProvider session={pageProps.session}>
      {renderModalAuth(modalType)}
      <ToastContainer autoClose={8000} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default App
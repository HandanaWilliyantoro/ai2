import React, { useCallback, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import { signOut } from 'next-auth/react';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'

const App = ({ Component, pageProps }) => {

  const handleRelog = useCallback(async () => {
    localStorage.clear()
    await signOut()
  }, [signOut])

  useEffect(() => {
    const session = pageProps?.session?.accessToken ?? '';
    const expiry = localStorage.getItem('expiry')
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + (60 * 300); // five hour;
    const parsedExpiry = JSON.parse(expiry);

    if(iat >= (parsedExpiry - 900) && parsedExpiry){
      handleRelog()
      return
    }

    if(session){
      if(!parsedExpiry){
        localStorage.setItem('expiry', JSON.stringify(exp));
      }
      localStorage.setItem('token', session)
    }
  }, [pageProps.session])

  return (
    <SessionProvider session={pageProps.session}>
      <ToastContainer autoClose={8000} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default App

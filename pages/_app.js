import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'

const App = ({ Component, pageProps }) => {

  useEffect(() => {
    const session = pageProps.session;
    
    console.log(session, 'ini session')

    if(session){
      localStorage.setItem('token', session.accessToken)
    } else {
      localStorage.clear()
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

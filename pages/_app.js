import React from 'react';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'

const App = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ToastContainer autoClose={8000} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default App
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css'

const App = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>Handana | AI Powered Search</title>
        <meta name='description' content="Handana is an AI-driven search engine uses advanced algorithms and natural language processing to deliver the most relevant and accurate results. A search engine that understand the user's intent and provide the best possible answer to their query. Perfect for businesses and individuals who need a reliable and comprehensive search engine." />
      </Head>
      <ToastContainer autoClose={8000} />
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default App

export function getServerSideProps () {

}
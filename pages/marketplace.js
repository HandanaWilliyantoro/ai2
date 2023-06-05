import React, {useState, useCallback, useEffect} from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'
import {IoMdArrowDropleft, IoMdLogOut} from 'react-icons/io'

// Components
import MyApps from '@/components/MyApps'
import Plugin from '@/components/Plugin'
import Application from '@/components/Application'
import Webhook from '@/components/Webhook'
import ModalAuthentication from '@/components/ModalAuthentication'

// Utils
import { market_category_menus } from '@/util/menus'

// Store
import getMarketContent from '@/stores/FetchMarketplaceContent.store'
import { showErrorSnackbar } from '@/util/toast'
import { signOut } from 'next-auth/react'

const Profile = observer(({session}) => {
  const [selected, setSelected] = useState('My Apps');
  const [content, setContent] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const router = useRouter()
  const {data} = useSession();

  //#region HANDLER
  const handleOnSelect = useCallback((a) => {
    setSelected(a)
    handleFetchContent(a)
  }, [setSelected]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    localStorage.clear();
    window.location.reload()
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token || session){
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [isAuthenticated, session]);

  /* Handle Authentication Feature */
  const handleRelog = useCallback(async () => {
    localStorage.clear()
    await signOut()
  }, [signOut])

  useEffect(() => {
      const session = data?.accessToken ?? '';
      const expiry = localStorage.getItem('expiry')
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + (60 * 300); // five hour;
      const parsedExpiry = JSON.parse(expiry);

      if(iat >= (parsedExpiry - 90) && parsedExpiry){
          handleRelog()
          return
      }

      if(session){
          if(!parsedExpiry){
            localStorage.setItem('expiry', JSON.stringify(exp));
          }
          localStorage.setItem('token', session)
      }
  }, [data, isAuthenticated])

  /* Component Did Mount */
  useEffect(() => {
    handleFetchContent(market_category_menus[0].label)
  }, []);
  //#endregion

  const render = useCallback(() => {
    switch(selected){
      case "My Apps":
        return <MyApps content={content}  />
      case "Plugin":
        return <Plugin content={content} />;
      case "Application":
        return <Application content={content} />;
      case "Webhook":
        return <Webhook content={content} />
    }
  }, [selected, content]);

  //#regino FETCH MARKETPLACE CONTENT
  /* Functions */
  const handleFetchContent = useCallback((a) => {
    getMarketContent.execute({type: a})
  }, [selected]);

  /* Watcher */
  useEffect(() => {
    if(getMarketContent.response){
      setContent(getMarketContent.response);
      getMarketContent.reset();
    } else if (getMarketContent.error) {
      showErrorSnackbar(getMarketContent.error)
      getMarketContent.reset();
    }
  }, [getMarketContent.response, getMarketContent.error, getMarketContent.reset]);
  //#endregion  

  return (
    <div className='max-w-screen-xl border-x-2 flex flex-col w-full h-screen mx-auto'>
      {!isAuthenticated && <ModalAuthentication setIsAuthenticated={setIsAuthenticated} />}
      <div className='w-full flex flex-row items-center justify-between px-4 py-3 border-b-4'>
        <p onClick={() => router.push('/')} className='flex flex-row items-center justify-start font-serif hover:opacity-70 transition cursor-pointer'><IoMdArrowDropleft className='mr-1' />Back</p>
        <p>AI Marketplace</p>
      </div>
      <div className='w-full h-full flex flex-row items-start justify-start'>
        <div className='flex flex-col h-full flex-[0.15] border-r-2'>
          {market_category_menus.map(a => (
            <div onClick={() => handleOnSelect(a.label)} className='px-3 py-4 flex flex-row items-center justify-start transition hover:opacity-60 cursor-pointer'>
              {a.icon}
              <p className={`font-serif text-sm mb-0 ml-2 ${selected === a.label && 'opacity-40'}`}>{a.label}</p>
            </div>
          ))}
          {isAuthenticated && (
            <div onClick={handleSignOut} className='px-3 py-4 mt-auto flex flex-row items-center justify-start transition hover:opacity-60 cursor-pointer'>
              <IoMdLogOut className="w-5 h-5" color="red" />
              <p className={`font-serif text-sm mb-0 ml-2 text-red-500`}>Sign Out</p>
            </div>
          )}
        </div>
        <div className='flex flex-col h-full flex-[0.85] border-l-2'>
            {render}
        </div>
      </div>
    </div>
  )
})

export default Profile

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
      props: {session}
  }
}
import React, {useState, useCallback, useEffect} from 'react'
import { observer } from 'mobx-react-lite'
import { useSession, getSession } from 'next-auth/react'

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
import Header from '@/components/Header'
import { sendError } from 'next/dist/server/api-utils'

const Marketplace = observer(({session}) => {
  const [content, setContent] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(market_category_menus[0].label)

  const {data} = useSession();

  //#region HANDLER
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token || session){
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [isAuthenticated, session]);

  const renderBody = useCallback(() => {
    switch(selected){
      case "My Apps":
        return <MyApps />
      case "Plugin":
        return <Plugin />
      case "Application":
        return <Application />
      case "Webhook":
        return <Webhook />
    }
  }, [selected]);

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
    if(isAuthenticated){
      handleFetchContent(market_category_menus[0].label)
    }
  }, [isAuthenticated]);
  //#endregion

  //#regino FETCH MARKETPLACE CONTENT
  /* Functions */
  const handleFetchContent = useCallback((a) => {
    getMarketContent.execute({type: a})
  }, []);

  /* Watcher */
  useEffect(() => {
    if(getMarketContent.response){
      setContent(getMarketContent.response);
      getMarketContent.reset();
    } else if (getMarketContent.error) {
      console.log(getMarketContent.error)
      getMarketContent.reset();
    }
  }, [getMarketContent.response, getMarketContent.error, getMarketContent.reset]);
  //#endregion  

  return (
    <div className='max-w-screen-lg border-x-2 flex flex-col w-full h-screen mx-auto relative'>
      {!isAuthenticated && <ModalAuthentication setIsAuthenticated={setIsAuthenticated} />}
      <Header value={search} setValue={setSearch} />
      <div className='w-full flex flex-row items-start justify-start h-full'>
        <div className='flex-[0.2] h-full border-r-2 max-md:border-none max-md:hidden'>
          {renderBody()}
        </div>
        <div className='flex=[0.8] max-md:flex-[1] h-[calc(100vh-230px)] flex items-center flex-col justify-center max-md:py-2 max-md:px-5'>
          {content && content.length > 0 ? content.map(a => (
            <div>

            </div>
          )) : (
            <div className='w-full flex items-center justify-center'>
              <p>Nothing to be shown here.</p>
            </div>
          )}
        </div>
      </div>
      <div id='footer' className='hidden max-md:flex max-w-screen-lg flex-row items-center justify-between w-full fixed bottom-0 mx-auto'>
        {market_category_menus.map(a => (
          <div onClick={() => setSelected(a.label)} style={{opacity: a.label === selected ? '0.4' : '1'}} className='py-5 border-2 border-gray-300 border-x-0 border-b-0 w-1/4 flex flex-col bg-white items-center justify-center'>
            {a.icon}
            <p className='text-sm mt-1 font-serif'>{a.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
})

export default Marketplace

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
      props: {session}
  }
}
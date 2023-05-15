import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import Search from "@/components/Search";
import Tagline from "@/components/Tagline";
import {RxChatBubble, RxPencil2, RxImage, RxMagicWand} from 'react-icons/rx'

export default function Home() {

  const [search, setSearch] = useState('');

  const router = useRouter()

  const onSubmitHandlerKeydown = useCallback((e) => {
    if(e.key === 'Enter'){
      e.preventDefault()
      router.push(`/search?q=${search}`)
    }
  }, [search, router.push])

  const onSubmitHandler = useCallback((e) => {
    e.preventDefault()
    router.push(`/search?q=${search}`)
  }, [search, router.push])

  const navigate = useCallback((url) => {
    router.push(url)
  }, [router.push]);

  return (
    <div className="min-w-screen min-h-screen bg-white flex flex-col items-center justify-center px-5 py-5">
        <div className="w-full md:w-auto mx-auto rounded-xl bg-gray-100 shadow-lg p-8 text-gray-800 relative overflow-hidden resize-x min-w-40 max-w-3xl flex flex-col items-center justify-center">
          <Logo />
          <Tagline />
          <Search onSubmitHandlerKeydown={onSubmitHandlerKeydown} onSubmitHandler={onSubmitHandler} onChange={e => setSearch(e.target.value)} value={search} />
          <div className="absolute top-0 left-0 w-full h-2 flex">
              <div className="h-2 bg-blue-500 flex-1"></div>
              <div className="h-2 bg-red-500 flex-1"></div>
              <div className="h-2 bg-yellow-500 flex-1"></div>
              <div className="h-2 bg-blue-500 flex-1"></div>
              <div className="h-2 bg-green-500 flex-1"></div>
              <div className="h-2 bg-pink-500 flex-1"></div>
          </div>
          <div className="flex flex-row items-center justify-center py-4">
            <p onClick={() => navigate('/chat')} className="flex flex-row text-sm font-bold cursor-pointer font-sans mx-3 transition hover:opacity-50"><RxChatBubble className='w-4 h-4 mr-1' />Chat</p>
            <p onClick={() => navigate('/image')} className="flex flex-row text-sm font-bold cursor-pointer font-sans mx-3 transition hover:opacity-50"><RxImage className='w-4 h-4 mr-1' />Image</p>
            <p onClick={() => navigate('/write')} className="flex flex-row text-sm font-bold cursor-pointer font-sans mx-3 transition hover:opacity-50"><RxPencil2 className='w-4 h-4 mr-1' />Write</p>
            <p onClick={() => navigate('/art')} className="flex flex-row text-sm font-bold cursor-pointer font-sans mx-3 transition hover:opacity-50"><RxMagicWand className='w-4 h-4 mr-1' />Art</p>
          </div>
        </div>
    </div>
  )
}

import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import Search from "@/components/Search";
import Tagline from "@/components/Tagline";
import SocialMedia from "@/components/SocialMedia";

export default function Home() {

  const [search, setSearch] = useState('');

  const router = useRouter()

  const onSubmitHandler = useCallback((e) => {
    if(e.key === 'Enter'){
      router.push(`/search?q=${search}`)
    }
  }, [search])

  return (
    <div className="min-w-screen min-h-screen bg-white flex flex-col items-center justify-center px-5 py-5">
        <div className="w-full md:w-auto mx-auto rounded-xl bg-gray-100 shadow-lg p-8 text-gray-800 relative overflow-hidden resize-x min-w-40 max-w-3xl flex flex-col items-center justify-center">
          <Logo />
          <Tagline />
          <Search onSubmitHandler={onSubmitHandler} onChange={e => setSearch(e.target.value)} value={search} />
          <div className="absolute top-0 left-0 w-full h-2 flex">
              <div className="h-2 bg-blue-500 flex-1"></div>
              <div className="h-2 bg-red-500 flex-1"></div>
              <div className="h-2 bg-yellow-500 flex-1"></div>
              <div className="h-2 bg-blue-500 flex-1"></div>
              <div className="h-2 bg-green-500 flex-1"></div>
              <div className="h-2 bg-pink-500 flex-1"></div>
          </div>
          <SocialMedia />
        </div>
    </div>
  )
}

import React, { useCallback, useState } from 'react'
import {SiTiktok, SiInstagram, SiLinkedin} from "react-icons/si"
import Logo from './Logo'
import { useRouter } from 'next/router'
import {RxMagnifyingGlass} from 'react-icons/rx'

const Header = () => {

    const [value, setValue] = useState('')

    const router = useRouter()

    const onChange = useCallback((e) => {
        setValue(e.target.value)
    }, [])

    const onSubmitHandler = useCallback((e) => {
        if(e.key === 'Enter'){
          router.push(`/search?q=${value}`)
        }
    }, [value])

    return (
        <div className='flex flex-row h-20 px-4 bg-white items-center justify-center w-full bordered border-b-0 max-md:flex-col max-md:h-auto max-md:py-4'>
            <div className='flex-[0.1] max-md:flex max-md:flex-row max-md:justify-between max-md:items-center max-md:w-full max-md:px-4'>
                <Logo textSize={"text-2xl"} />
                <div className='hidden max-md:flex max-md:items-center'>
                    <SiTiktok className='cursor-pointer mx-2' />
                    <SiInstagram className='cursor-pointer mx-2' />
                    <SiLinkedin className='cursor-pointer mx-2 mr-0' />
                </div>
            </div>
            <div className='flex-[0.5] h-full flex flex-col w-full p-4 max-md:flex-[0.8] max-md:p-2'>
                <div className="relative mt-1 w-full">
                <input onKeyDown={onSubmitHandler} onChange={onChange} value={value} type="text" id="password" className="w-full font-sans rounded-full text-sm pl-4 pr-10 py-1 border-2 border-black-200 hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Search..."/>
                <button onClick={onSubmitHandler} className="block w-7 h-7 pl-1 font-serif text-center text-xl leading-0 absolute top-0.5 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors"><RxMagnifyingGlass /></button>
            </div>
            </div>
            <div className='flex-[0.4] flex flex-row items-center justify-end px-0 max-md:hidden'>
                <SiTiktok className='cursor-pointer mx-2' />
                <SiInstagram className='cursor-pointer mx-2' />
                <SiLinkedin className='cursor-pointer mx-2 mr-0' />
            </div>
        </div>
    )
}

export default Header
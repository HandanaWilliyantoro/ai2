import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { IoMdLogOut } from 'react-icons/io'
import Logo from './Logo'
import {menus} from '@/util/menus'
import { signOut } from 'next-auth/react'
import { RxMagnifyingGlass, RxUpdate } from 'react-icons/rx'
import { AiFillThunderbolt } from 'react-icons/ai'

const Header = ({onSubmitHandler, value, setValue, onSubmitHandlerKeyDown}) => {
    const router = useRouter()

    const logout = useCallback(async () => {
        await signOut()
        await localStorage.clear()
        window.location.reload()
    }, [signOut]);

    const navigate = useCallback((url) => {
        router.push(url)
    }, [])

    return (
        <div className='flex flex-row h-20 px-4 bg-white items-center justify-center w-full bordered border-b-2 max-md:flex-col max-md:h-auto max-md:py-4 max-md:pb-0 max-md:px-1'>
            <div className='flex-[0.1] max-md:flex max-md:flex-row max-md:justify-between max-md:items-center max-md:w-full max-md:px-4'>
                <Logo textSize={"text-lg"} />
                <div className='hidden max-md:flex max-md:items-center'>
                    <RxUpdate onClick={() => navigate('/update')} color='black' className='cursor-pointer mx-2 mr-0 w-5 h-5' />
                    <IoMdLogOut onClick={logout} color='red' className='cursor-pointer mx-2 mr-0 w-5 h-5' />
                </div>
            </div>
            <div className='flex-[0.5] flex flex-col w-full p-4 py-0 mt-auto max-md:flex-[0.8] max-md:p-2'>
                <div className="relative w-full">
                <input onKeyDown={(e) => onSubmitHandlerKeyDown(e)} onChange={e => setValue(e.target.value)} value={value} type="text" className="w-full text-black bg-white font-sans rounded-full text-sm pl-4 pr-10 py-1 border-2 border-black-200 hover:border-gray-300 focus:outline-none focus:border-blue-500 transition-colors md:-mb-4" placeholder="Search..."/>
                <button onClick={onSubmitHandler} className="block w-7 h-7 pl-1 font-serif text-center text-xl leading-0 absolute top-0.5 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors"><RxMagnifyingGlass /></button>
                <div className='flex flex-row mt-3 pb-2'>
                    {menus.map(a => (
                        <div key={a.slug} onClick={() => navigate(a.slug)} className={`flex flex-row items-center transition hover:opacity-50 text-gray-500 font-bold cursor-pointer mx-2`}>
                            {a.icon}
                            <p className='text-xs ml-1'>{a.label}</p>
                        </div>
                    ))}
                </div>
            </div>
            </div>
            <div className='flex-[0.4] flex flex-row items-center justify-end px-0 max-md:hidden'>
                <RxUpdate onClick={() => navigate('/update')} className='cursor-pointer mx-2 mr-0 ml-3 w-5 h-5' />
                <IoMdLogOut onClick={logout} color='red' className='cursor-pointer mx-2 mr-0 ml-3 w-5 h-5' />
            </div>
        </div>
    )
}

export default Header
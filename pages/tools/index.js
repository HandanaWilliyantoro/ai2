import React from 'react'
import { RxMagnifyingGlass } from 'react-icons/rx'

import Header from '@/components/Header'
import { toolOptions } from '@/util/menus'

const Tools = () => {
  return (
    <div className='max-w-screen-lg flex flex-col border-2 border-black-500 h-screen m-auto'>
        <Header />
        <div className='flex flex-col items-center justify-start h-[calc(100vh-4rem)] overflow-y-scroll'>
            <p className='text-3xl text-center font-sans font-bold my-8 mb-2'>Empowering Your Ideas with AI Brilliance:<br/>Your One-Stop AI Tool Hub</p>
            <div className='flex flex-row items-center justify-center w-full'>
                <input placeholder='Search Tools..' className='w-3/4 py-2 px-3 my-4 border-black-400 border-2 rounded outline-none' />
                <RxMagnifyingGlass className='w-6 h-6 ml-2 cursor-pointer hover:opacity-40 transition' />
            </div>
            <div className='flex flex-row flex-wrap w-4/5 justify-between items-start'>
                {toolOptions.length > 0 ? toolOptions.map(a => (
                    <div className='flex flex-row border-2 my-2 w-[260px] h-[90px] items-center transition hover:opacity-50 cursor-pointer justify-center p-4 px-2 border-gray-300 rounded-md'>
                        {a.icon}
                        <div className='flex flex-col ml-4 w-full'>
                            <h5 className='font-serif font-bold text-sm mb-1'>{a.name}</h5>
                            <p className='font-serif text-xs'>{a.description}</p>
                        </div>
                    </div>
                )) : (
                    <p>Tools Not Found</p>
                )}
            </div>
        </div>
    </div>
  )
}

export default Tools
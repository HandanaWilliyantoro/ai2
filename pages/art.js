import React, { useCallback, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import {} from 'react-icons'

// Components
import Header from '@/components/Header'

const Art = observer(() => {
    const [search, setSearch] = useState('')

    const router = useRouter();

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

      const onClickEmail = useCallback(() => {
        const url = 'mailto:handanawilliyantoro9298@gmail.com'
        window.open(url, '_blank')
      }, []);
    //#endregion

    return (
        <div className='max-w-screen-lg mx-auto border-x-2 overflow-y-scroll bg-white h-screen relative max-md:flex max-md:flex-col'>
            <Header onSubmitHandler={onSubmitHandler} onSubmitHandlerKeyDown={onSubmitHandlerKeydown} value={search} setValue={setSearch} />
            <div className='w-full h-[calc(100%-100px)] justify-center items-center flex flex-col'>
                <p className='text-xl font-bold font-serif w-full text-center'>AI Art is no longer available</p>
                <p className='text-sm text-center mx-32 mt-2'>We apologize for any inconvenience caused, 
                but we would like to inform you that the AI Art feature is no longer available and we want to thank you for your support and participation. 
                If you have any further questions or concerns, please don't hesitate to contact us at <span onClick={onClickEmail} className='cursor-pointer hover:underline font-bold text-blue-400'>handanawilliyantoro9298@gmail.com</span>. For more information. 
                <br/><br/>We sincerely appreciate your understanding and patience as we continue to improve our services.</p>
            </div>
        </div>
    )
})

export default Art
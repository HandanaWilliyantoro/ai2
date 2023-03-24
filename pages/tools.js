import React, {useState, useCallback} from 'react'


// Components
import Header from '@/components/Header'

const Tools = () => {

    //#region STATE
    const [search, setSearch] = useState('')
    //#endregion

    //#region HANDLER
    const onChangeInput = useCallback((e) => {
        setSearch(e.target.value)
    }, []);
    //#endregion

    return (
        <div className='max-w-screen-lg m-auto h-screen overflow-y-scroll border-2'>
            <Header />
            <div className='flex flex-col items-center justify-center p-4'>
                <p className='font-serif text-base font-bold my-2'>Unleash the Power of AI with Tools that Hub your Way to Success!</p>
                <input className='rounded w-full border-2 outline-none p-2' placeholder='Search AI Tools' value={search} onChange={onChangeInput} />
            </div>
            <div className='flex flex-row flex-wrap h-full'>

            </div>
        </div>
    )
}

export default Tools
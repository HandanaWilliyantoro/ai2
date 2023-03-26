import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { showErrorSnackbar } from '@/util/toast';

import Loading from '@/components/Loading';
import Header from '@/components/Header';

// Stores
import { observer } from 'mobx-react-lite';
import findImage from '@/stores/Image.store';
import findStockImage from '@/stores/StockImage.store';

const Search = observer(() => {
    const [search, setSearch] = useState('')
    const [images, setImages] = useState('');
    const [commercial, setCommercial] = useState()

    const router = useRouter();

    //#region HANDLE FETCH STOCK IMAGE SEARCH
    const handleFetchStockImage = useCallback((q) => {
        findStockImage.execute({q})
    }, []);

    /* Watcher */
    useEffect(() => {
        if(findStockImage.response){
            setImages(findStockImage.response)
            findStockImage.reset()
        } else if (findStockImage.error) {
            showErrorSnackbar(findStockImage.error);
            findStockImage.reset()
        }
    }, [findStockImage.response, findStockImage.error, findStockImage.reset])
    //#endregion

    //#region HANDLE FETCH SEARCH
    /* Execute */
    const handleFetchSearch = useCallback((q, commercial) => {
        findImage.execute({q, commercial})
    }, [commercial, search, findImage.execute]);

    /* Watcher */
    useEffect(() => {
        if(findImage.response){
            setImages(findImage.response);
            findImage.reset()
        } else if (findImage.error) {
            showErrorSnackbar(findImage.error)
            findImage.reset()
        }
    }, [findImage.response, findImage.error, findImage.reset])
    //#endregion

    //#region HANDLER
    /* Component Did Mount */
    useEffect(() => {
        if(!router.isReady) return;

        if(router.query.q){
            setSearch(router.query.q)
            if(commercial){
                handleFetchStockImage(router.query.q)
            } else {
                handleFetchSearch(router.query.q)
            }
        } else {
            router.push('/image')
        }
    }, [router.isReady, router.query.q])

    /* On Check Commercial */
    const checkCommercial = useCallback(async (e) => {
        if(!commercial){
            setCommercial('commercial')
            handleFetchStockImage(search)
        } else {
            setCommercial(undefined)
            handleFetchSearch(search)
        }
    }, [setCommercial, handleFetchSearch, search, images, commercial]);

    const onSubmitHandler = useCallback(() => {
        router.push(`/image/search?q=${search}`);
    }, [search])

    const onSubmitHandlerKeyDown = useCallback((e) => {
        if(e.key === 'Enter'){
            router.push(`/image/search?q=${search}`)
        }
    }, [search])
    //#endregion

    return (
        <div className='max-w-screen-lg mx-auto border-x-2 overflow-y-scroll h-screen relative bg-white'>
            <Header onSubmitHandler={onSubmitHandler} onSubmitHandlerKeyDown={onSubmitHandlerKeyDown} value={search} setValue={setSearch} />
            <div className='flex flex-row items-center w-full pt-4 px-4 justify-between'>
                <div className="flex flex-row items-center bg-white">
                    <input checked={commercial} onClick={checkCommercial} className="rounded-full text-white cursor-pointer" name='commercial-use' type={'checkbox'} />
                    <label for='commercial-use' className="ml-1 font-serif text-xs text-black">Royalty Free</label>
                </div>
                <button onClick={() => router.push('/image/art')} className='p-2 text-white border bg-black font-serif text-xs rounded transition hover:bg-white hover:border-black hover:text-black'>Generate AI Art</button>
            </div>
            {images.length > 0 && !findImage.loading ? (
                <div className='w-full flex flex-row flex-wrap items-start pb-4'>
                    {images.map(a => (
                        <div onClick={() => window.open(a.source_url, '_blank')} className='flex flex-col p-2 m-auto my-4 cursor-pointer transition hover:opacity-50 max-md:max-w-[45%]'>
                            <img className='w-[250px] h-[320px] object-cover rounded object-center max-md:w-[150px] max-md:h-[150px]' src={a.thumbnail_url} alt={a.title} key={a.id} />
                            <p className="font-sans text-black font-bold text-xs truncate w-56 my-1 mt-2 max-md:max-w-full max-md:max-h-xs">{a.source}</p>
                            <p className="truncate text-xs w-56 text-black max-md:max-w-full max-md:max-h-xs">{a.title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[calc(100vh-180px)] w-full flex justify-center items-center" >
                    <Loading text={`Searching images for "${router.query.q}"`} />
                </div>
            )}
        </div>
    )
})

export default Search
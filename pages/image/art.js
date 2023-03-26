import React, { useCallback, useEffect, useState } from 'react'
import DefaultImg from '@/util/assets/default_art.png'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'

// Components
import {RxArrowLeft} from 'react-icons/rx'
import Header from '@/components/Header'
import createArt from '@/stores/Art.store'
import { showErrorSnackbar } from '@/util/toast'
import Loading from '@/components/Loading'

const Art = observer(() => {
    const [prompt, setPrompt] = useState('Woman Elf');
    const [style, setStyle] = useState('Realistic');
    const [quality, setQuality] = useState('4k');
    const [image, setImage] = useState('');

    const router = useRouter();

    //#region FETCH IMAGE
    const handleFetchImage = useCallback(async () => {
        const combinedPrompt = `${prompt ? `${prompt}, ` : undefined}${style ? `${style}, ` : undefined}${quality ? quality : undefined}`
        createArt.execute({prompt: combinedPrompt})
    }, [prompt, style, quality]);

    /* Watcher */
    useEffect(() => {
        if(createArt.response){
            setImage(createArt.response)
            createArt.reset()
        } else if (createArt.error) {
            showErrorSnackbar(createArt.error)
            createArt.reset()
        }
    }, [createArt.reset, createArt.response, createArt.error])
    //#endregion

    return (
        <div className='max-w-screen-lg mx-auto border-x-2 overflow-y-scroll bg-white h-screen relative max-md:flex max-md:flex-col'>
            <Header />
            <div className='flex flex-row items-center justify-between mx-4'>
                <p onClick={() => router.push('/image/search')} className='font-serif cursor-pointer text-sm transition hover:opacity-50 text-black flex items-center'><RxArrowLeft className='mr-1 w-4 h-4' />Search Image</p>
                <p className='font-serif mt-2 text-lg text-gray-400 font-bold ml-4 py-2 max-md:text-sm'>Image / Art Generator</p>
            </div>
            <div className='min-h-[calc(100vh-135px)] flex flex-row items-start justify-start w-full mt-4 pb-8 max-md:pb-4 max-md:min-h-[calc(100vh-190px)] max-md:flex-col'>
                <div className='flex-[0.5] flex flex-col items-start justify-start min-h-[calc(100vh-135px)] max-md:min-h-[auto] max-md:max-h-[300px] w-full border-black'>
                    <div className='flex-col flex items-start mx-4 mb-2 w-3/4'>
                        <label className='text-xs font-serif mb-1'>Prompt</label>
                        <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Ex: an astronaut riding a horse on mars" className='rounded bg-white text-black border-2 p-1 pl-2 py-2 w-full font-serif text-xs outline-none'  />
                    </div>
                    <div className='flex-col flex items-start justify-start ml-4 my-2 w-3/4'>
                        <label className='text-xs font-serif mb-1'>Style</label>
                        <select value={style} onChange={e => setStyle(e.target.value)} placeholder="Ex: Realistic" className='rounded border-2 p-1 bg-white text-black pr-4 w-full font-serif py-2 text-xs outline-none'>
                            <option value={'Realistic'}>Realistic</option>
                            <option value={'Elegant'}>Elegant</option>
                            <option value={'Artisitic'}>Artisitic</option>
                        </select>
                    </div>
                    <div className='flex-col flex items-start justify-start ml-4 my-2 w-3/4'>
                        <label className='text-xs font-serif mb-1'>Quality</label>
                        <select value={quality} onChange={e => setQuality(e.target.value)} placeholder="Ex: Realistic" className='rounded border-2 bg-white text-black p-1 pr-4 w-full py-2 font-serif text-xs outline-none'>
                            <option value={'4k'}>4k</option>
                            <option value={'8k'}>8k</option>
                        </select>
                    </div>
                    <button disabled={createArt.loading} onClick={handleFetchImage} className='font-serif text-xs ml-4 w-20 bg-black text-white outline-none py-2 rounded transition mt-2 border border-black hover:text-black hover:bg-white'>{createArt.loading ? "Loading.." : "Submit"}</button>
                </div>
                <div className='flex-[0.5] max-md:w-full flex flex-col min-h-[calc(100vh-180px)] max-md:min-h-[auto] max-md:py-4 items-start justify-start px-2'>
                    {createArt.loading ? (
                        <div className='m-auto block max-md:w-full'>
                            <Loading text={`Generating Art for "${prompt}"`} />
                        </div>
                    ) : (
                        <img onClick={() => window.open(image || DefaultImg.src, '_blank')} className='w-full transition cursor-pointer hover:opacity-50 h-auto object-cover object-center rounded' src={image || DefaultImg.src} alt={image.uri} />
                    )}
                </div>
            </div>
        </div>
    )
})

export default Art
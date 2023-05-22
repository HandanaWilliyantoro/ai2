import React, { useCallback, useEffect, useState } from 'react'
import DefaultImg from '@/util/assets/default_art.png'
import { useRouter } from 'next/router'
import { observer } from 'mobx-react-lite'
import { getSession, useSession } from 'next-auth/react'

import createArt from '@/stores/Art.store'
import getModels from '@/stores/FetchModels.store'
import getAllModels from '@/stores/FetchAllModels.store'
import getProfile from '@/stores/Profile.store'

// Components
import {RxArrowLeft} from 'react-icons/rx'
import { showErrorSnackbar } from '@/util/toast'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import ModalAuthentication from '@/components/ModalAuthentication'
import ModalPremiumArt from '@/components/ModalPremiumArt'
import initiatePayment from '@/stores/InitiatePayment.store'

const Art = observer(({session}) => {
    const {status} = useSession()

    const [prompt, setPrompt] = useState('Woman Elf');
    const [image, setImage] = useState('');
    const [search, setSearch] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(status === 'authenticated' ? true : undefined)
    const [isPremiumArtOpened, setIsPremiumArtOpened] = useState(false)
    const [model, setModel] = useState("epic_diffusion_1_1")
    const [modelOptions, setModelOptions] = useState([])
    const [negative_prompt, setNegativePrompt] = useState()
    const [width, setWidth] = useState(1024)
    const [height, setHeight] = useState(1024)
    const [premiumModelOptions, setPremiumModelOptions] = useState([])
    const [user, setUser] = useState({})

    const router = useRouter();

    //#region FETCH USER PROFILE
    const handleFetchUser = useCallback(() => {
        const token = localStorage.getItem('token');
        if((session && session.accessToken) || token){
            getProfile.execute({accessToken: session?.accessToken || token})
        }
    }, [session, session?.accessToken]);

    /* Watcher */
    useEffect(() => {
        if(getProfile.response){
            setUser(getProfile.response);
            localStorage.setItem('user', JSON.stringify(getProfile.response))
            getProfile.reset()
        } else if (getProfile.error) {
            console.log(getProfile.error)
            showErrorSnackbar("Failed to fetch profile")
            getProfile.reset()
        }
    }, [getProfile.response, getProfile.error, getProfile.reset])
    //#endregion

    //#region FETCH MODELS
    const handleFetchModels = useCallback((all) => {
        const token = localStorage.getItem('token')
        if(session?.accessToken || token){
            getModels.execute({accessToken: session?.accessToken ? session?.accessToken : token, all})
        }
    }, [session]);

    /* Watcher */
    useEffect(() => {
        if(getModels.response){
            setModelOptions(getModels.response)
            getModels.reset()
        } else if (getModels.error) {
            showErrorSnackbar(getModels.error)
            getModels.reset()
        }
    }, [getModels.response, getModels.error, getModels.reset])
    //#endregion

    //#region FETCH ALL MODELS
    const handleFetchAllModels = useCallback(() => {
        const token = localStorage.getItem('token')
        if(session?.accessToken || token){
            getAllModels.execute({accessToken: session?.accessToken ? session?.accessToken : token})
        }
    }, [session]);

    /* Watcher */
    useEffect(() => {
        if(getAllModels.response){
            setPremiumModelOptions(getAllModels.response)
            getAllModels.reset()
        } else if (getAllModels.error) {
            showErrorSnackbar(getAllModels.error)
            getAllModels.reset()
        }
    }, [getAllModels.response, getAllModels.error, getAllModels.reset])
    //#endregion

    //#region FETCH IMAGE
    const handleFetchImage = useCallback(async (e) => {
        e.preventDefault()

        if(!prompt && isAuthenticated){
            showErrorSnackbar('Prompt field is required')
            return;
        }

        if (createArt.loading) return;

        if(!isAuthenticated){
            setIsAuthenticated(false)
            return;
        }

        createArt.execute({prompt, model, negative_prompt, width, height, premium: user.premium})
    }, [prompt, model, isAuthenticated, negative_prompt, width, height, user.premium, createArt.loading]);

    /* Watcher */
    useEffect(() => {
        if(createArt.response){
            setImage(createArt.response)
            localStorage.setItem('art-image', createArt.response);
            localStorage.setItem('art-prompt', prompt);
            localStorage.setItem('art-model', model)
            if(user.premium){
                createArt.reset()
            } else {
                window.location.reload();
            }
        } else if (createArt.error) {
            showErrorSnackbar(createArt.error)
            createArt.reset()
        }
    }, [createArt.reset, createArt.response, createArt.error, isAuthenticated, createArt.loading])
    //#endregion

    //#region INITIATE PAYMENT
    const handleInitiatePayment = useCallback(() => {
        const token = localStorage.getItem('token');
        if((session && session.accessToken) || token){
            initiatePayment.execute({gross_amount: 50000, accessToken: session?.accessToken || token})
        }
    }, [session, session?.accessToken]);

    /* Watcher */
    useEffect(() => {
        if(initiatePayment.response){
            initiatePayment.reset();
            window.location.reload()
        } else if (initiatePayment.error) {
            console.log(initiatePayment.error)
            initiatePayment.reset();
        }
    }, [initiatePayment.response, initiatePayment.error, initiatePayment.reset])

    //#endregion

    //#region HANDLER
    useEffect(() => {
        const item = localStorage.getItem('token')
        if(item){
            const artImage = localStorage.getItem('art-image')
            const artPrompt = localStorage.getItem('art-prompt')
            const artModel = localStorage.getItem('art-model')
            const userStorage = localStorage.getItem('user');
            const user = JSON.parse(userStorage);
            if(!user.premium && artModel && artImage && artPrompt){
                var adsScript = document.createElement('script');
                adsScript.setAttribute('src','//ophoacit.com/1?z=5966193');
                adsScript.setAttribute('async','async');
                adsScript.setAttribute('id','interstitial-ads');
                adsScript.setAttribute('data-cfasync','false');
                document.body.appendChild(adsScript);
            }
            if(artImage){
                setImage(artImage)
            }
            if(artPrompt){
                setPrompt(artPrompt)
            }
            if(artModel){
                setModel(artModel)
            }
            handleFetchModels()
            handleFetchUser()
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [isAuthenticated])

    const onChangeWidth = useCallback((e) => {
        if(Number(e.target.value) < 0){
            return;
        }
        setWidth(Number(e.target.value))
    }, []);

    const onChangeHeight = useCallback((e) => {
        if(Number(e.target.value) < 0){
            return;
        }
        setHeight(Number(e.target.value))
    }, []);

    const handleOpenModalPremium = useCallback(() => {
        setIsPremiumArtOpened(true)
        handleFetchAllModels()
    }, [setIsPremiumArtOpened, handleFetchAllModels])

    const onClickUnlockPremium = useCallback(() => {
        handleInitiatePayment()
    }, [handleInitiatePayment]);

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
    //#endregion

    return (
        <div className='max-w-screen-lg mx-auto border-x-2 overflow-y-scroll bg-white h-screen relative max-md:flex max-md:flex-col'>
            {/* Modal Authentication */}
            {!isAuthenticated && <ModalAuthentication setIsAuthenticated={setIsAuthenticated} />}

            {/* Modal premium art */}
            <ModalPremiumArt 
                isOpen={isPremiumArtOpened} 
                onRequestClose={() => setIsPremiumArtOpened(false)} 
                options={premiumModelOptions}
                onClickUnlockPremium={onClickUnlockPremium}
            />

            <Header onSubmitHandler={onSubmitHandler} onSubmitHandlerKeyDown={onSubmitHandlerKeydown} value={search} setValue={setSearch} />
            <div className='flex flex-row items-center justify-between mx-4'>
                <p onClick={() => router.back()} className='font-serif cursor-pointer text-sm transition hover:opacity-50 mt-2 py-2 text-black flex items-center font-bold'><RxArrowLeft className='mr-2 w-5 h-5' />AI ART GENERATOR{user.premium ? <span className='py-0.7 px-2 text-[10px] font-serif text-transparent animate-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded ml-2'>Extra Mode</span> : <span className='py-0.7 px-2 text-[10px] bg-black text-white rounded ml-2'>Free Mode</span>}</p>
            </div>
            <div className='flex flex-row items-start justify-start w-full my-4 max-md:mt-2 max-md:pb-4 max-md:min-h-[calc(100vh-190px)] max-md:flex-col'>
                <div className='flex-[0.5] flex flex-col items-start justify-start min-h-[calc(100vh-135px)] px-4 max-md:min-h-[auto] max-md:max-h-[400px] w-full border-black'>
                    <div className='flex-col flex items-start mx-0 mb-2.5 w-full'>
                        <label className='text-xs text-black font-serif mb-1'>Prompt</label>
                        <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Ex: an astronaut riding a horse on mars" className='rounded bg-white text-black border-2 p-1 pl-2 py-2 w-full font-serif text-xs outline-none'  />
                    </div>
                    <div className='flex-col flex items-start mx-0 mb-2.5 w-full'>
                        <label className='text-xs text-black font-serif mb-1'>Negative Prompt</label>
                        <input value={negative_prompt} onChange={e => setNegativePrompt(e.target.value)} placeholder="Ex: ugly, tiling, poorly drawn hands" className='rounded bg-white text-black border-2 p-1 pl-2 py-2 w-full font-serif text-xs outline-none'  />
                    </div>
                    <div className='flex-col flex items-start mx-0 mb-2.5 w-full'>
                        <label className='text-xs text-black font-serif mb-1'>Width (320 - 1024)</label>
                        <input type='number' value={width} onChange={onChangeWidth} placeholder="Ex: an astronaut riding a horse on mars" className='rounded bg-white text-black border-2 p-1 pl-2 py-2 w-full font-serif text-xs outline-none'  />
                    </div>
                    <div className='flex-col flex items-start mx-0 mb-2.5 w-full'>
                        <label className='text-xs text-black font-serif mb-1'>Height (320 - 1024)</label>
                        <input type='number' value={height} onChange={onChangeHeight} placeholder="Ex: an astronaut riding a horse on mars" className='rounded bg-white text-black border-2 p-1 pl-2 py-2 w-full font-serif text-xs outline-none'  />
                    </div>
                    <div className='flex-col flex items-start justify-start mb-2.5 w-full'>
                        <label className='text-xs text-black font-serif mb-1'>Model ({modelOptions.length})</label>
                        <select value={model} onChange={e => setModel(e.target.value)} placeholder="Ex: Epic Diffusion" className='rounded border-2 bg-white text-black p-1 pr-4 w-full py-2 font-serif text-xs outline-none'>
                            {modelOptions && modelOptions.length > 0 && modelOptions.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-row items-start justify-start mt-2 w-full'>
                        <button disabled={createArt.loading} onClick={handleFetchImage} className='font-serif mb-2 w-full text-xs bg-black text-white outline-none py-2 rounded transition border border-black hover:text-black hover:bg-white'>{!isAuthenticated ? 'Sign In' : (createArt.loading ? "Loading.." : `Generate`)}</button>
                        {!user.premium && (
                            <button onClick={handleOpenModalPremium} className='font-serif text-transparent animate-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 w-full ml-2 bg-black text-white text-xs py-2 rounded outline-none transition hover:opacity-50'>Go Extra</button>
                        )}
                    </div>
                    {!user.premium && <p className='font-sans text-xs w-full text-center mt-2 text-black max-md:mt-0.5'>To offset the expenses of the AI art generator,<br/>advertisements will be displayed.</p>}
                </div>
                <div className='flex-[0.5] max-md:w-full flex flex-col max-md:mt-4 max-md:min-h-[auto] max-md:py-4 items-start justify-start px-2'>
                    {createArt.loading ? (
                        <div className='m-auto block max-md:w-full'>
                            <Loading text={`Generating Art for "${prompt}"`} />
                        </div>
                    ) : (
                        <img className='w-full transition cursor-pointer hover:opacity-50 h-auto object-cover object-center rounded' src={image || DefaultImg.src} alt={image.uri} />
                    )}
                </div>
            </div>
        </div>
    )
})

export default Art

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    return {
        props: {session}
    }
}
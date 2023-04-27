import React, {useState, useCallback, useEffect, useRef} from 'react'
import {AiOutlineSync, AiOutlineInfoCircle, AiFillCopy} from 'react-icons/ai'
import {BsFillSendFill, BsPersonSquare, BsPlugin, BsSun, BsLightning} from 'react-icons/bs'
import { useRouter } from 'next/router'
import { showErrorSnackbar, showSuccessSnackbar } from '@/util/toast'
import { getSession, useSession } from 'next-auth/react'
import ReactLoading from 'react-loading';

// Data
import Plugins from '@/util/assets/plugins.json'

// Stores
import { observer } from 'mobx-react-lite'
import postChat from '@/stores/Chat.store'
import createArt from '@/stores/Art.store'

// Components
import ModalPersona from '@/components/ModalPersona'
import ModalAction from '@/components/ModalSend'
import Header from '@/components/Header'
import ImageSkeleton from '@/components/ImageSkeleton'
import ChatSkeleton from '@/components/ChatSkeleton'
import ModalAuthentication from '@/components/ModalAuthentication'
import ModalUserPlugin from '@/components/ModalUserPlugin'

const chat = observer(({session}) => {
    const {status} = useSession()

    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('')
    const [persona, setPersona] = useState([
        {
            title: 'General',
            description: 'Engage in meaningful conversations with our friendly general persona.',
            selected: true
        },
        {
            title: 'Full stack developer',
            description: 'Building seamless solutions through intelligent conversations with our full stack developer AI persona.',
            selected: false,
        },
        {
            title: 'Legal Advisor',
            description: 'Expert legal advice at your fingertips',
            selected: false
        },
        {
            title: 'Writer',
            description: 'Unlock your writing potential with our creative and insightful AI writer persona.',
            selected: false
        },
        {
            title: 'Travel Guide',
            description: 'Embark on unforgettable journeys with the guidance of our experienced AI travel advisor persona.',
            selected: false
        },
        {
            title: 'Advertiser',
            description: 'Maximize your reach with the strategic insights of our AI advertiser persona.',
            selected: false,
        },
        {
            title: 'Stand-up comedian',
            description: 'Laugh out loud with our witty and entertaining AI stand-up comedian persona.',
            selected: false,
        },
        {
            title: 'Motivational Speaker',
            description: 'Find inspiration and reach your goals with the uplifting guidance',
            selected: false
        },
        {
            title: 'Debater',
            description: 'Sharpen your arguments and challenge your beliefs with our intelligent AI debater persona.',
            selected: false,
        },
        {
            title: 'Dream Interpreter',
            description: 'Unlock the secrets of your subconscious mind',
            selected: false
        },
        {
            title: 'Historian',
            description: 'Discover the past and gain valuable insights into the present',
            selected: false
        },
        {
            title: 'Mental health advisor',
            description: 'Find peace of mind and support on your mental health journey with our caring and knowledgeable AI advisor persona.',
            selected: false
        },
        {
            title: 'Chef',
            description: 'Experience culinary delight with the guidance of our skilled and innovative AI chef persona.',
            selected: false
        },
        {
            title: 'DIY Expert',
            description: 'Unleash your inner handyman with the expert advice of our innovative and creative AI DIY expert persona.',
            selected: false
        },
        {
            title: 'English Translator',
            description: 'Translating language barriers into seamless conversations.',
            selected: false,
        },
        {
            title: 'Storyteller',
            description: 'Let me take you on a journey through the power of words.',
            selected: false
        },
        {
            title: 'Composer',
            description: 'Compose your world with the melodies of your imagination.',
            selected: false
        },
        {
            title: 'Philosopher',
            description: "Exploring the depths of life's biggest questions, together.",
            selected: false
        },
        {
            title: 'Accountant',
            description: 'Chat on us to keep your finances in order.',
            selected: false
        },
        {
            title: 'Lunatic',
            description: 'Unlocking the absurdity of life, one chat at a time.',
            selected: false
        }
    ])
    const [plugins, setPlugins] = useState(Plugins.map(a => ({...a, selected: false})))
    const [answer, setAnswer] = useState('');
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isModalPersonaOpened, setIsModalPersonaOpened] = useState(false)
    const [isModalActionOpened, setIsModalActionOpened] = useState(false)
    const [isModalPluginOpened, setIsModalPluginOpened] = useState(false)
    const [selectedAction, setSelectedAction] = useState('');
    const [conversationId, setConversationId] = useState()
    const [isAuthenticated, setIsAuthenticated] = useState(status === 'authenticated' ? true : undefined)

    const divRef = useRef(null);
    const router = useRouter();

    const scrollToBottom = () => {
        divRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [history.length])

    //#region FETCH CHAT ANSWER
    const handleFetchAnswer = useCallback((params) => {
        if(isLoading) return;
        setIsLoading(true);
        const contentChecker = params && params.length > 1 ? params[params.length - 1].content :  params[params.length - 1].content.input
        if(contentChecker && contentChecker.split(' ')[0] === '!image'){
            const processedPrompt = contentChecker.replace('!image ', '')
            createArt.execute({prompt: processedPrompt ?? 'dummy'})
        } else {
            if(history.length < 1){
                const query = input.toLowerCase()
                const findPersona = persona.find(a => a.selected).title
                const pluginUrl = plugins?.find(a => a.selected)?.url ?? ''
                postChat.execute({query, persona: findPersona, history: params, pluginUrl})
            } else {
                const query = input.toLowerCase()
                const pluginUrl = plugins.find(a => a.selected).url
                postChat.execute({query, conversationId, history: params, pluginUrl})
            }
        }
    }, [input, conversationId, persona, history]);

    /* Watcher Image */
    useEffect(() => {
        if(createArt.response){
            const parsedHistory = JSON.parse(JSON.stringify(history))
            setHistory([...parsedHistory, {role: 'assistant', content: createArt.response}])
            setInput('')
            setIsLoading(false)
            createArt.reset()
        } else if (createArt.error) {
            setIsLoading(false);
            setInput('')
            showErrorSnackbar(createArt.error)
            createArt.reset()
        }
    }, [createArt.response, createArt.error, createArt.reset]);

    /* Watcher Text */
    useEffect(() => {
        if(postChat.response){
            setIsLoading(false)
            const parsedHistory = JSON.parse(JSON.stringify(history))
            setHistory([...parsedHistory, {role: 'assistant', content: postChat.response}])
            setInput('')
            postChat.reset()
        } else if (postChat.error) {
            setIsLoading(false)
            showErrorSnackbar('Our chat feature is currently down, please come back later')
            postChat.reset();
        }
    }, [postChat.response, postChat.error, postChat.reset])
    //#endregion

    //#region HANDLER
    const onClickReset = useCallback(() => {
        setHistory([]);
        setAnswer('')
    }, []);

    const onSubmitHandler = useCallback(() => {
        router.push(`/search?q=${search}`)
    }, [search])

    const onSubmitHandlerKeyDown = useCallback((e) => {
        if(e.key === 'Enter'){
            router.push(`/search?q=${search}`)
        }
    }, [search]);

    const onChangeInput = useCallback((e) => {
        setInput(e.target.value)
    }, [])

    const onClickEnter = useCallback((e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
    
            if(isLoading) return;
    
            if(!isAuthenticated){
                setIsAuthenticated(false)
                return;
            }
    
            if(!input) {
                return
            };

            const parsedHistory = JSON.parse(JSON.stringify(history))
            const selectedPersona = persona?.find(a => a.selected)?.title ?? undefined
            if(parsedHistory.length > 1){
                setHistory([...parsedHistory, {role: 'user', content: input}])
                const params = [...parsedHistory, {role: 'user', content: input}]
                handleFetchAnswer(params)
            } else {
                setHistory([{role: 'user', content: {input, persona: selectedPersona}}])
                const params = [...parsedHistory, {role: 'user', content: {input, persona: selectedPersona}}]
                handleFetchAnswer(params)
            }
        }
    }, [input, history, persona]);

    const onClickArrow = useCallback(() => {
        
        if(isLoading) return;
        
        if(!isAuthenticated){
            setIsAuthenticated(false)
            return;
        }

        if(!input) {
            return
        };

        const selectedPersona = persona.find(a => a.selected).title
        const parsedHistory = JSON.parse(JSON.stringify(history))
        scrollToBottom()
        if(parsedHistory.length > 0){
            setHistory([...parsedHistory, {role: 'user', content: input}])
            const params = [...parsedHistory, {role: 'user', content: input}]
            handleFetchAnswer(params)
        } else {
            setHistory([...parsedHistory, {role: 'user', content: {input, persona: selectedPersona}}])
            const params = [...parsedHistory, {role: 'user', content: {input, persona: selectedPersona}}]
            handleFetchAnswer(params)
        }
    }, [input, history, persona, isAuthenticated]);

    const onClickCopy = useCallback(async (text) => {
        await navigator.clipboard.writeText(text);

        showSuccessSnackbar(`Copy to clipboard!`)
    }, []);

    const renderBody = useCallback(() => {
        if(history.length > 0){
            return <div className='flex flex-col items-start justify-start w-full h-full'>
                {history.map((a, i) => {
                    if(a.role === 'user'){
                        return <div key={i} className='text-left text-sm p-4'>
                            <p className='font-serif text-black'>{a.content.input ?? a.content}</p>
                        </div>
                    } else if (a.role === 'assistant') {
                        return <div key={i} className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full relative'>
                            {a && a.content && a.content.includes('base64') ? (
                                <img className='w-[275px] h-[275px] cursor-pointer object-center rounded transition hover:opacity-50' src={a.content} alt='generated ai image' />
                            ) : (
                                <div>
                                    {plugins && plugins.find(a => a.selected)?.name ? <p className='text-xs py-2 px-3 rounded bg-green-200 text-green-500 font-sans font-bold w-[fit-content] mb-2'>Plugin: {plugins.find(a => a.selected).name}</p> : undefined}
                                    <div className='font-serif text-black' dangerouslySetInnerHTML={{__html: a.content.replace(/\n?```([\s\S]*?)```/g, "\n<pre><code>$1</code></pre>")}} />
                                </div>
                            )}
                            <div className='flex flex-row items-center justify-start mt-4'>
                                <p onClick={() => onSelectAction(a.content)} className='font-sans text-black text-xs font-bold flex flex-row items-center mr-4 transition cursor-pointer hover:opacity-50'><BsFillSendFill className='mr-1' /> Send</p>
                                <p onClick={() => onClickCopy(a.content)} className='font-sans text-black text-xs font-bold flex flex-row items-center transition cursor-pointer hover:opacity-50'><AiFillCopy className='mr-1' /> Copy</p>
                            </div>
                        </div>
                    }
                })}
                {(postChat.loading) && (
                    <div className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full relative'>
                        {plugins && plugins.find(a => a.selected)?.name ? <p className='text-xs flex flex-row items-center justify-center py-2 px-3 rounded bg-green-200 text-green-500 font-sans font-bold w-[fit-content] mb-4'>Plugin: {plugins.find(a => a.selected).name} <ReactLoading className='ml-2 flex items-center' type='spin' color={'#939393'} height={'auto'} width={15} /></p> : undefined}
                        <ChatSkeleton />
                    </div>
                )}
                {createArt.loading && (
                    <div className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full relative'>
                        <ImageSkeleton />
                        <p className="mt-1 font-sans text-sm font-bold text-black">Generating Art..</p>
                    </div>
                )}
                {answer && (
                    <div className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full'>
                            <div className='font-serif text-black' dangerouslySetInnerHTML={{__html: answer.replace(/\n?```([\s\S]*?)```/g, "\n<pre><code>$1</code></pre>")}} />
                    </div>
                )}
            </div>
        }

        if(history.length === 0 && !answer) {
            return <div className='flex flex-row bg-white items-center justify-center w-full h-full'>
                <div className='flex flex-col items-center justify-center h-full w-[30%] mx-3 max-md:w-[40%]'>
                    <BsSun className='w-8 h-8 mb-1' />
                    <p className='font-bold font-serif text-sm text-black'>Examples</p>
                    <div className='my-3 border-2 border-gray-300 shadow-lg rounded w-full flex items-center justify-center p-1 px-2 h-20 mx-2'>
                        <p className='text-center font-serif text-xs text-gray-500'>Write me an essay about technology</p>
                    </div>
                    <div className='my-3 border-2 border-gray-300 shadow-lg rounded w-full flex items-center justify-center p-1 px-2 h-20 mx-2'>
                        <p className='text-center font-serif text-xs text-gray-500'>How to speak with animal</p>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center h-full w-[30%] mx-3 max-md:w-[40%]'>
                    <BsLightning className='w-8 h-8 mb-1' />
                    <p className='font-bold font-serif text-sm text-black'>Capabilities</p>
                    <div className='my-3 border-2 border-gray-300 shadow-lg rounded w-full flex items-center justify-center p-1 px-2 h-20 mx-2'>
                        <p className='text-center font-serif text-xs text-gray-500'>Plugins to empower chat capabilities</p>
                    </div>
                    
                    <div className='my-3 border-2 border-gray-300 shadow-lg rounded w-full flex items-center justify-center p-1 px-2 h-20 mx-2'>
                        <p className='text-center font-serif text-xs text-gray-500'>Persona option customized<br/>based on your need</p>
                    </div>
                </div>
            </div>
        }
    }, [persona, answer, history]);

    const onSelectPersona = useCallback(async (a) => {
        const i = persona.findIndex(el => el === a);
        let parsePersona = await JSON.parse(JSON.stringify(persona));
        const newPersona = await parsePersona.map((element, index) => {
            if(index === i){
                return {
                    ...element,
                    selected: !element.selected
                }
            } else {
                return {
                    ...element,
                    selected: false
                }
            }
        })
        onClickReset()
        setPersona(newPersona)
    }, [persona, onClickReset]);

    const onSelectPlugin = useCallback(async (a) => {
        const i = plugins.findIndex(el => el === a);
        let parsePlugin = await JSON.parse(JSON.stringify(plugins));
        const newPlugins = await parsePlugin.map((element, index) => {
            if(index === i){
                return {
                    ...element,
                    selected: !element.selected
                }
            } else {
                return {
                    ...element,
                    selected: false
                }
            }
        })
        onClickReset()
        setPlugins(newPlugins)
    }, [plugins]);

    const onSelectAction = useCallback((val) => {
        setIsModalActionOpened(true);
        setSelectedAction(val)
    }, [])

    useEffect(() => {
        onClickReset()
        const item = localStorage.getItem('token')
        if(item || session){
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [isAuthenticated])
    //#endregion

    return (
        <div className='max-w-screen-md m-auto h-screen relative border bg-white'>
            {isAuthenticated === false && <ModalAuthentication setIsAuthenticated={setIsAuthenticated} />}

            {/* Modal Plugin */}
            <ModalUserPlugin
                isOpen={isModalPluginOpened}
                onRequestClose={() => setIsModalPluginOpened(!isModalPluginOpened)}
                plugins={plugins}
                onSelectPlugin={onSelectPlugin}
            />

            {/* Modal Persona */}
            <ModalPersona
                isOpen={isModalPersonaOpened}
                onRequestClose={() => setIsModalPersonaOpened(!isModalPersonaOpened)}
                persona={persona}
                setPersona={setPersona}
                onSelectPersona={onSelectPersona}
            />

            {/* Modal Action */}
            <ModalAction
                isOpen={isModalActionOpened}
                onRequestClose={() => setIsModalActionOpened(!isModalActionOpened)}
                data={selectedAction}
                setSelectedAction={setSelectedAction}
            />

            {/* Header */}
            <Header onSubmitHandlerKeyDown={onSubmitHandlerKeyDown} onSubmitHandler={onSubmitHandler} value={search} setValue={setSearch} />

            {/* Body */}
            <div className='h-[calc(100vh-180px)] overflow-y-scroll max-md:h-[calc(100vh-225px)]'>
                {renderBody()}
            </div>

            {/* Footer */}
            <div className='absolute w-full max-w-screen-md bg-white bottom-0 flex flex-col items-start pb-4'>
                <div className='flex flex-row items-center py-2 w-full'>
                    <div className='relative mr-2 flex flex-row justify-center items-center'>
                        <p onClick={() => setIsModalPersonaOpened(!isModalPersonaOpened)} className='font-serif text-xs ml-4 text-black flex flex-row items-center hover:underline cursor-pointer'><BsPersonSquare className='w-4 h-4 mr-1' />Persona</p>
                        <p onClick={() => setIsModalPluginOpened(!isModalPluginOpened)} className='font-serif text-xs ml-4 text-black flex flex-row items-center hover:underline cursor-pointer'><BsPlugin className='w-4 h-4 mr-1' />Plugin</p>
                    </div>
                    <div className='group relative ml-auto mr-2 flex justify-center'>
                        <AiOutlineInfoCircle className='text-black' />
                        <span className="absolute bottom-10 w-[250px] scale-0 right-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                            <p className='font-bold mb-2 text-xs'>Advance Operator</p>
                            <p className="font-sans text-xs">Art Generator : use !image operator to generate image (ex: !image an indonesian man)</p>
                        </span>
                    </div>
                    <div onClick={() => onClickReset()} className='flex flex-row text-black items-center mr-4 cursor-pointer transition hover:opacity-60'>
                        <AiOutlineSync />
                        <p className='text-xs ml-1'>Reset</p>
                    </div>
                </div>
                <div className='w-full flex flex-row items-center justify-center'>
                    <input disabled={isLoading} onKeyDown={onClickEnter} value={input} onChange={onChangeInput} placeholder='Write me a tiktok ads copy' className='w-full text-black bg-white mx-2 px-3 py-2 outline-none border-2 rounded font-sans' />
                    <button onClick={onClickArrow} className='px-2 py-2.5 w-1/6 max-md:w-1/3 bg-black text-white font-serif text-sm font-bold rounded mr-3 border-1 border-black'>{isAuthenticated ? 'Submit' : 'Sign In'}</button>
                </div>
            </div>
        </div>
    )
})

export default chat

export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    return {
        props: {session}
    }
}
import React, {useState, useCallback, useEffect, useRef, createElement} from 'react'
import {AiOutlineDoubleRight, AiOutlineSync, AiOutlineInfoCircle, AiFillCopy} from 'react-icons/ai'
import {BsFillSendFill} from 'react-icons/bs'
import { useRouter } from 'next/router'
import Persona from '../util/assets/persona.png'
import { showErrorSnackbar, showSuccessSnackbar } from '@/util/toast'

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

const chat = observer(() => {

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
    const [answer, setAnswer] = useState('');
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isModalPersonaOpened, setIsModalPersonaOpened] = useState(false)
    const [isModalActionOpened, setIsModalActionOpened] = useState(false)
    const [selectedAction, setSelectedAction] = useState('');
    const [conversationId, setConversationId] = useState()

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
        if(contentChecker.split(' ')[0] === '!image'){
            const processedPrompt = contentChecker.replace('!image ', '')
            createArt.execute({prompt: processedPrompt ?? 'dummy'})
        } else {
            if(history.length < 1){
                const query = input.toLowerCase()
                const findPersona = persona.find(a => a.selected).title
                postChat.execute({query, persona: findPersona})
            } else {
                const query = input.toLowerCase()
                postChat.execute({query, conversationId})
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
            setHistory([...parsedHistory, {role: 'assistant', content: postChat.response.data}])
            setConversationId(postChat.response.conversationId)
            setInput('')
            postChat.reset()
        } else if (postChat.error) {
            setIsLoading(false)
            showErrorSnackbar(postChat.error);
            setInput('')
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

        if(isLoading) return;

        if(e.key === 'Enter'){
            const parsedHistory = JSON.parse(JSON.stringify(history))
            const selectedPersona = persona.find(a => a.selected).title
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
        }
    }, [input, history, persona, scrollToBottom]);

    const onClickArrow = useCallback(() => {
        if(isLoading) return;
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
    }, [input, history, persona]);

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
                            {a.content && a.content.includes('base64') ? (
                                <img className='w-[275px] h-[275px] cursor-pointer object-center rounded transition hover:opacity-50' src={a.content} alt='generated ai image' />
                            ) : (
                                <div className='font-serif text-black' dangerouslySetInnerHTML={{__html: a.content.replace(/\n?```([\s\S]*?)```/g, "\n<pre><code>$1</code></pre>")}} />
                            )}
                            <div className='flex flex-row items-center justify-start mt-4'>
                                <p onClick={() => onSelectAction(a.content)} className='font-sans text-black text-xs font-bold flex flex-row items-center mr-4 transition cursor-pointer hover:opacity-50'><BsFillSendFill className='mr-1' /> Send</p>
                                <p onClick={() => onClickCopy(a.content)} className='font-sans text-black text-xs font-bold flex flex-row items-center transition cursor-pointer hover:opacity-50'><AiFillCopy className='mr-1' /> Copy</p>
                            </div>
                        </div>
                    }
                })}
                {postChat.loading && (
                    <div className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full relative'>
                        <ChatSkeleton />
                    </div>
                )}
                {createArt.loading && (
                    <div className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full relative'>
                        <ImageSkeleton />
                        <p className="mt-1 font-sans text-sm font-bold text-black">Generating Art..</p>
                    </div>
                )}
            </div>
        }

        if(history.length === 0 && !answer) {
            return <div className='flex flex-col bg-white items-center justify-center w-full h-full'>
                <img className='w-40 h-40 rounded' src={Persona.src} />
                <p className='font-sans text-black text-base mt-4'>Current AI Persona</p>
                <p className='font-bold text-black font-serif text-base'>{persona.find(a => a.selected === true).title}</p>
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
                    selected: true
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

    const onSelectAction = useCallback((val) => {
        setIsModalActionOpened(true);
        setSelectedAction(val)
    }, [])

    useEffect(() => {
        onClickReset()
    }, [])
    //#endregion

    return (
        <div className='max-w-screen-md m-auto h-screen relative border bg-white'>
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
                    <p onClick={() => setIsModalPersonaOpened(!isModalPersonaOpened)} className='font-serif text-xs ml-4 text-black flex flex-row items-center hover:underline cursor-pointer'>See Persona Library <AiOutlineDoubleRight className='w-2 h-2 ml-1' /></p>
                    <div className='group relative ml-auto mr-2 flex justify-center'>
                        <AiOutlineInfoCircle className='text-black' />
                        <span className="absolute bottom-10 w-[250px] scale-0 right-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                            <p className='font-bold mb-2 text-sm'>Advance Operator</p>
                            <p className="font-sans text-xs">Art Generator : use !image operator to generate image (ex: !image an indonesian man)</p>
                        </span>
                    </div>
                    <div onClick={() => onClickReset()} className='flex flex-row text-black items-center mr-10 cursor-pointer transition hover:opacity-60'>
                        <AiOutlineSync />
                        <p className='text-xs ml-1'>Reset</p>
                    </div>
                </div>
                <div className='w-full flex flex-row items-center justify-center'>
                    <input disabled={isLoading} onKeyDown={onClickEnter} value={input} onChange={onChangeInput} placeholder='Write me a tiktok ads copy' className='w-full text-black bg-white mx-2 px-3 py-2 outline-none border-2 rounded font-sans' />
                    <AiOutlineDoubleRight onClick={onClickArrow} className='w-5 h-5 mr-2 text-black cursor-pointer' />
                </div>
            </div>
        </div>
    )
})

export default chat
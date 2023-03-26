import React, {useState, useCallback, useEffect, useRef} from 'react'
import {AiOutlineDoubleRight, AiOutlineSync} from 'react-icons/ai'
import { useRouter } from 'next/router'
import Persona from '../util/assets/persona.png'

// Stores
import { observer } from 'mobx-react-lite'
import postChat from '@/stores/Chat.store'

// Components
import Header from '@/components/Header'
import { showErrorSnackbar } from '@/util/toast'

const personas = [
    'General',
    'Full Stack Developer',
    'Legal Advisor',
    'Writer',
    'Travel Guide',
    'Advertiser',
    'Stand-up Comedian',
    'Motivational Speaker',
    'Debater',
    'Dream Interpreter',
    'Historian',
    'Mental Health Adviser',
    'Chef',
    'DIY Expert'
]

const chat = observer(() => {

    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('')
    const [persona, setPersona] = useState('General')
    const [answer, setAnswer] = useState('');
    const [search, setSearch] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const divRef = useRef(null);
    const router = useRouter();

    const scrollToBottom = () => {
        divRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [history])
    
    //#region FETCH CHAT ANSWER
    const handleFetchAnswer = useCallback((params) => {
        if(postChat.loading || isLoading) return;
        setIsLoading(true)
        postChat.execute({history: params})
    }, []);

    /* Watcher */
    useEffect(() => {
        if(postChat.response){
            setIsLoading(false)
            const response = JSON.parse(JSON.stringify(answer))
            setAnswer(`${response + postChat.response}`)
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

    const onChangePersona = useCallback((e) => {
        setPersona(e.target.value)
        setHistory([])
    }, [])

    const onClickEnter = useCallback((e) => {

        if(isLoading) return;

        if(e.key === 'Enter'){
            const parsedHistory = JSON.parse(JSON.stringify(history))
            scrollToBottom()
            if(parsedHistory.length > 0){
                setHistory([...parsedHistory, {role: 'user', content: input}])
                const params = [...parsedHistory, {role: 'user', content: input}]
                handleFetchAnswer(params)
            } else {
                setHistory([...parsedHistory, {role: 'user', content: {input, persona}}])
                const params = [...parsedHistory, {role: 'user', content: {input, persona}}]
                handleFetchAnswer(params)
            }
        }
    }, [input, history, persona, scrollToBottom]);

    const onClickArrow = useCallback(() => {
        if(isLoading) return;
        const parsedHistory = JSON.parse(JSON.stringify(history))
        scrollToBottom()
        if(parsedHistory.length > 0){
            setHistory([...parsedHistory, {role: 'user', content: input}])
            const params = [...parsedHistory, {role: 'user', content: input}]
            handleFetchAnswer(params)
        } else {
            setHistory([...parsedHistory, {role: 'user', content: {input, persona}}])
            const params = [...parsedHistory, {role: 'user', content: {input, persona}}]
            handleFetchAnswer(params)
        }
    }, [input, history, persona]);

    /* Watcher when request has finisihed */
    useEffect(() => {
        if(postChat.finished){
            const parsedHistory = JSON.parse(JSON.stringify(history))
            setHistory([...parsedHistory, {role: 'assistant', content: answer}])
            setAnswer('')
            setInput('')
        }
    }, [postChat.finished])

    const renderBody = useCallback(() => {

        if(history.length > 0){
            return <div className='flex flex-col items-start justify-start w-full h-full'>
                {history.map((a, i) => {
                    if(a.role === 'user'){
                        return <div key={i} className='text-left text-sm p-4'>
                            <p className='font-serif text-black'>{a.content.input ?? a.content}</p>
                        </div>
                    } else if (a.role === 'assistant') {
                        return <div key={i} className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full'>
                            <div className='font-serif text-black' dangerouslySetInnerHTML={{__html: a.content.replace(/\n?```([\s\S]*?)```/g, "\n<pre><code>$1</code></pre>")}} />
                        </div>
                    }
                })}
                {answer && (
                    <div className='text-left text-sm p-4 bg-gray-100 whitespace-pre-line w-full'>
                            <div className='font-serif text-black' dangerouslySetInnerHTML={{__html: answer.replace(/\n?```([\s\S]*?)```/g, "\n<pre><code>$1</code></pre>")}} />
                    </div>
                )}
            </div>
        }

        if(history.length === 0 && !answer) {
            return <div className='flex flex-col bg-white items-center justify-center w-full h-full'>
                <img className='w-40 h-40 rounded' src={Persona.src} />
                <p className='font-sans text-black text-base mt-4'>Current AI Persona</p>
                <p className='font-bold text-black font-serif text-base'>{persona}</p>
            </div>
        }
    }, [persona, answer, history]);

    useEffect(() => {
        onClickReset()
    }, [])
    //#endregion

    return (
        <div className='max-w-screen-md m-auto h-screen relative border bg-white'>
            {/* Header */}
            <Header onSubmitHandlerKeyDown={onSubmitHandlerKeyDown} onSubmitHandler={onSubmitHandler} value={search} setValue={setSearch} />

            {/* Body */}
            <div className='h-[calc(100vh-180px)] overflow-y-scroll max-md:h-[calc(100vh-245px)]'>
                {renderBody()}
            </div>

            {/* Footer */}
            <div className='absolute w-full max-w-screen-md bg-white bottom-0 flex flex-col items-start pb-4'>
                <div className='flex flex-row items-center py-2 w-full'>
                    <p className='font-serif text-xs ml-4 text-black'>Current Personality:</p>
                    <select onChange={onChangePersona} defaultValue={persona} className='text-xs border-2 bg-white text-black border-black rounded ml-2 font-sans outline-none py-1'>
                        {personas.map(a => (
                            <option key={a} className='font-sans py-2' value={a}>{a}</option>
                        ))}
                    </select>
                    <div onClick={() => onClickReset()} className='flex flex-row text-black items-center ml-auto mr-10 cursor-pointer transition hover:opacity-60'>
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
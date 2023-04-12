import React, {useCallback, useEffect, useState} from 'react'
import { useRouter } from 'next/router'

// Store
import { observer } from 'mobx-react-lite'
import postWrite from '@/stores/Write.store'

// Utils
import { writeOptions } from '@/util/menus'

// Components
import Header from '@/components/Header'
import Loading from '@/components/Loading'
import { showErrorSnackbar, showSuccessSnackbar } from '@/util/toast'

const Write = observer(() => {

    const [search, setSearch] = useState('');
    const [form, setForm] = useState([
        {
            placeholder: 'Example: Write an email to my potential investor for my AI business',
            value: "",
            name: 'keywords' ,
            label: 'What do you want to generate?'
        }
    ])
    const [selected, setSelected] = useState(
        {"name":"Custom Writer", "slug": 'custom-generator', "specialFeature":false, "description": "Generate custom text for any purpose.", form: [
            {
                placeholder: 'Example: Write an email to my potential investor for my AI business',
                value: "",
                name: 'keywords' ,
                label: 'What do you want to generate?'
            }
        ]}
    )
    const [answer, setAnswer] = useState('')

    const router = useRouter();

    //#region FETCH ANSWER
    const handleFetchAnswer = useCallback(() => {
        let obj = {slug: selected.slug};
        for(let i = 0 ; i < form.length ; i++) {
            if(form[i].value){
                obj[form[i].name] = form[i].value
            } else {
                showErrorSnackbar('Please input the required field')
                return;
            }
        }
        showSuccessSnackbar('Processing your answer');
        postWrite.execute(obj)
        setAnswer('');
    }, [form, selected]);

    /* Watcher */
    useEffect(() => {
        if(postWrite.response){
            setAnswer(postWrite.response)
            showSuccessSnackbar('Generate answer successfull')
            postWrite.reset()
        } else if (postWrite.error) {
            showErrorSnackbar('Failed to fetch answer')
            postWrite.reset()
        }
    }, [postWrite.response, postWrite.error, postWrite.reset])
    //#endregion 

    //#region HANDLER
    const onSubmitHandler = useCallback(() => {
        router.push(`/search?q=${search}`)
    }, [search])

    const onSubmitHandlerKeyDown = useCallback((e) => {
        if(e.key === 'Enter'){
            e.preventDefault()
            router.push(`/search?q=${search}`)
        }
    }, [search]);

    const handleOnClickOption = useCallback((name) => {
        const data = writeOptions.find(a => a.name === name);
        setSelected(data)
        setForm(data.form);
        setAnswer('')
    }, [writeOptions]);

    const handleOnChangeInput = useCallback((e) => {
        let previousInput = JSON.parse(JSON.stringify(form));
        const index = previousInput.findIndex(a => a.name === e.target.name);
        previousInput[index].value = e.target.value;
        setForm(previousInput)
    }, [form])

    /* Handle on submit */
    const onClickSubmit = useCallback(() => {
        if(postWrite.loading) return ;
        handleFetchAnswer()
    }, [handleFetchAnswer]);
    //#endregion

    return (
        <div className='max-w-screen-lg bg-white text-black m-auto border h-screen overflow-y-hidden max-md:overflow-y-scroll max-md:[&::-webkit-scrollbar]:hidden max-md:[-ms-overflow-style:"none"] max-md:[scrollbar-width:"none"]'>
            <Header onSubmitHandlerKeyDown={onSubmitHandlerKeyDown} onSubmitHandler={onSubmitHandler} value={search} setValue={setSearch} />
            <div className='flex flex-row items-start flex-1 h-full max-md:flex-col'>
                <div className='flex-[0.25] bg-gray-100 overflow-y-scroll max-h-[calc(100vh-5rem)] border-black border-r-0 py-2 px-4 max-md:hidden'>
                    {writeOptions.map(a => (
                        <p onClick={() => handleOnClickOption(a.name)} className={`${selected.name === a.name && 'opacity-40'} max-md:text-base text-sm font-sans mb-4 cursor-pointer transition-opacity hover:opacity-40`}>{a.name}</p>
                    ))}
                </div>
                <div className='flex-[0.75] p-4 flex flex-col items-start justify-start h-full max-md:w-full max-md:py-5 max-md:flex-[1]'>
                    <h4 className='text-xl font-bold font-serif'>{selected.name}</h4>
                    <p className='text-sm my-1 font-sans text-gray-400'>{selected.description}</p>
                    <div className="hidden max-md:flex max-md:py-2 max-md:flex-row max-md:items-start max-md:justify-start max-md:overflow-x-scroll max-md:overflow-y-hidden max-md:max-w-[calc(100vw-2rem)] max-md:pb-0">
                        {writeOptions.map(a => (
                            <p onClick={() => handleOnClickOption(a.name)} 
                                className={`
                                ${selected.name === a.name && 'opacity-40'} 
                                max-md:inline-block max-md:pb-2 whitespace-nowrap max-md:mr-3 max-md:text-sm font-sans cursor-pointer transition-opacity hover:opacity-40`
                            }>{a.name}</p>
                        ))}
                    </div>
                    <div className='border mt-2 border-gray-400 rounded-lg w-full h-[calc(100%-180px)] flex flex-row max-md:flex-col max-md:h-full'>
                        <div className='flex-[0.5] border h-full border-r-1 flex flex-col items-center justify-center max-md:p-4'>
                            {form.length > 0 && form.map(a => (
                                <div className='flex flex-col w-[calc(100%-4rem)] my-2'>
                                    <label className='text-xs font-sans mb-1'>{a.label}</label>
                                    <textarea className='font-sans text-black bg-white p-2 outline-none border border-black rounded text-xs' onChange={handleOnChangeInput} placeholder={a.placeholder} value={a.value} name={a.name} />
                                </div>
                            ))}
                            <button onClick={onClickSubmit} className='text-xs bg-black text-white py-2 px-4 rounded ml-auto mt-2 mr-[2rem]'>{postWrite.loading ? "Loading.." : "Submit"}</button>
                        </div>
                        <div className='flex-[0.5] border h-full border-l-1 overflow-y-scroll'>
                            {answer ? (
                                <p className={'font-sans text-black text-xs whitespace-pre-line p-4'}>{answer.replace(/\n/g,'\n\n')}</p>
                            ) : (
                                <Loading text={postWrite.loading ? 'Generating Answer' : 'Answer will be displayed here'} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default Write
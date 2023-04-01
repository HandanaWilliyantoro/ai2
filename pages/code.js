import React, {useState, useCallback, useEffect} from 'react'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import Header from '@/components/Header'
import Loading from '@/components/Loading';

import { observer } from 'mobx-react-lite';
import postCode from '@/stores/Code.store';

import { showErrorSnackbar } from '@/util/toast';

const languageOptions = [
    'Javascript',
    'Java',
    'Python',
    'Golang',
    'Ruby',
]

const Code = observer(() => {

    const [code, setCode] = useState('// Example Function\nfunction add(a, b) {\n  return a + b;\n}')
    const [input, setInput] = useState('')
    const [lang, setLang] = useState('Javascript')
    const [isLoading, setIsLoading] = useState(false)

    //#region HANDLE CODE
    const handleFetchCode = useCallback((language, query) => {
        setIsLoading(true)
        postCode.execute({language, query})
    }, [input, lang])

    /* Watcher */
    useEffect(() => {
        if(postCode.response){
            setIsLoading(false)
            const formattedCode = formatCode(postCode.response)
            setCode(formattedCode)
            postCode.reset()
        } else if (postCode.error) {
            setIsLoading(false)
            showErrorSnackbar(postCode.error)
            postCode.reset()
        }
    }, [postCode.response, postCode.error, postCode.reset])
    //#endregion

    //#region HANDLER
    const onClickEnter = useCallback((e) => {
        if(e.key === 'Enter'){
            handleFetchCode(lang, input)
        }
    }, [handleFetchCode, lang, input])

    const handleChangeLang = useCallback((e) => {
        if(input){
            handleFetchCode(e.target.value, input)
        } else {
            handleFetchCode(e.target.value, 'write me an add function')
        }
        setLang(e.target.value)
    }, [handleFetchCode, input, setLang, lang]);

    const formatCode = useCallback((codeString) => {
        let indentLevel = 0;
        let formattedCode = "";
      
        // split code string into lines
        const lines = codeString.trim().split("\n");
      
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
      
          if (line.endsWith("{")) {
            // increase indentation level for opening brace
            formattedCode += `${"\t".repeat(indentLevel)}${line}\n`;
            indentLevel++;
          } else if (line.startsWith("}")) {
            // decrease indentation level for closing brace
            indentLevel--;
            formattedCode += `${"\t".repeat(indentLevel)}${line}\n`;
          } else {
            // add indentation for other lines
            formattedCode += `${"\t".repeat(indentLevel)}${line}\n`;
          }
        }

        console.log(formattedCode, 'ini formmated Code')
        return formattedCode;
    }, [])
    //#endregion

    return (
        <div className='max-w-screen-lg flex flex-col border-2 border-black-500 h-screen m-auto'>
            <Header />
            <div className='flex flex-col items-center justify-start h-[calc(100vh-4rem)] overflow-y-scroll'>
                <p className='text-3xl text-center font-sans font-bold my-8 mb-2 max-md:mt-4'>Write Less, Code More.</p>
                <p className='text-sm text-gray-400 font-serif text-center max-md:mx-4 max-md:my-1'>Unleash the power of code with just a click - let our generator do the trick!</p>
                <div className='flex flex-row items-center justify-center w-full max-md:px-2'>
                    <select disabled={isLoading} value={lang} onChange={handleChangeLang} className='mr-2 cursor-pointer border-2 py-2 border-black-500 outline-none rounded font-serif text-sm max-md:w-42 max-md:mr-0 max-md:text-xs'>
                        {languageOptions && languageOptions.map(a => <option className='cursor-pointer' value={a} key={a}>{a}</option>)}
                    </select>
                    <input disabled={isLoading} onKeyDown={onClickEnter} value={input} onChange={e => setInput(e.target.value)} placeholder='Enter specifications here to generate custom code' className='w-3/4 max-md:text-xs max-md:ml-1 max-md:w-full py-2 px-3 text-sm my-4 border-black-400 border-2 rounded outline-none' />
                </div>
                <div className='w-[85%] flex justify-center items-center max-md:mt-2'>
                    {!isLoading ? (
                        <SyntaxHighlighter language={lang.toLowerCase()}>
                            {code.trim()}
                        </SyntaxHighlighter>
                    ) : (
                        <Loading text={'Loading'} />
                    )}
                </div>
            </div>
        </div>
    )
})

export default Code
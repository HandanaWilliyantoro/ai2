import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router"

import SummarySkeleton from "@/components/SummarySkeleton";
import Header from "@/components/Header";
import SourcesSkeleton from "@/components/SourcesSkeleton";
import SearchSkeleton from "@/components/SearchSkeleton";
import SearchPagination from "@/components/SearchPagination";

import getSearch from "@/stores/Search.store";
import summarizer from "@/stores/Summarize.store";
import { observer } from "mobx-react-lite";
import { showErrorSnackbar } from "@/util/toast";
import summarizerBackup from "@/stores/SummarizeBackup.store";

const search = observer(() => {
    const [summary, setSummary] = useState();
    const [currPage, setCurrPage] = useState(1)
    const [search_result, setSearchResult] = useState()
    const [totalPage, setTotalPage] = useState(1)
    const [questionHistory, setQuestionHistory] = useState([])
    const [followUpSearch, setFollowUpSearch] = useState('')
    const [search, setSearch] = useState('')

    //#region HOOKS
    const router = useRouter()
    const paginationRef = useRef(null)
    const scrollToBottom = () => {
        paginationRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [currPage]);
    //#endregion

    //#region ASK FOLLOW UP
    const handleAskFollowUp = useCallback(async () => {
        setSummary('')
        setSearchResult(undefined)
        setFollowUpSearch('')
        handleFetchSearch(followUpSearch)
    }, [questionHistory, followUpSearch]);
    //#endregion

    //#region FETCH SUMMARIZER BACKUP
    const handleFetchSummarizerBackup = useCallback(() => {
        const params = {
            q: questionHistory.length > 0 ? questionHistory : router.query.q,
            summaryContent: search_result.summaryContent
        }
        summarizerBackup.execute(params)
    }, [questionHistory, router, search_result])

    const handleSummary = useCallback(async (sum) => {
        const response = summary ? await JSON.parse(JSON.stringify(summary)) : ''
        setSummary(`${response + sum}`)
    }, [setSummary, summary])

    /* Watcher */
    useEffect(() => {
        if(summarizerBackup.response){
            setSummary(summarizerBackup.response)
            summarizerBackup.reset()
        } else if (summarizerBackup.error) {
            showErrorSnackbar(summarizerBackup.error)
            summarizerBackup.reset()
        }
    }, [summarizerBackup.response, summarizerBackup.error, summarizerBackup.reset]);
    //#endregion
    
    //#region FETCH SUMMARIZER
    /* Execute */
    const handleFetchSummarizer = useCallback((val) => {
        const params = {
            q: questionHistory.length > 0 ? questionHistory : router.query.q,
            summaryContent: val.summaryContent
        }
        summarizer.execute(params)
    }, [router.query.q, questionHistory, summarizer.execute]);
    
    /* Watcher */
    useEffect(() => {
        if(summarizer.response){
            handleSummary(summarizer.response)
            summarizer.reset()
        } else if (summarizer.error) {
            handleFetchSummarizerBackup()
            summarizer.reset()
        }
    }, [summarizer.response, summarizer.error, summarizer.reset])
    //#endregion
    
    //#region FETCH SEARCH RESULTS
    const handleFetchSearch = useCallback(async (q) => {
        const history = await JSON.parse(JSON.stringify(questionHistory))
        setQuestionHistory([...history, q])
        getSearch.execute({q: [...history, q]})
    }, [questionHistory]);

    /* Watcher */
    useEffect(() => {
        if(getSearch.response){
            setSearchResult(getSearch.response)
            setTotalPage(Math.ceil(getSearch.response.response.data.length / 7))
            handleFetchSummarizer(getSearch.response)
            getSearch.reset()
        } else if (getSearch.error) {
            showErrorSnackbar(getSearch.error)
            getSearch.reset()
        }
    }, [getSearch.response, getSearch.error, getSearch.reset])
    //#endregion

    //#region HANDLER
    /* Component Did Mount */
    useEffect(() => {

        if(!router.isReady) return;

        if(router.query.q){
            setQuestionHistory([])
            setFollowUpSearch('')
            setSummary(undefined)
            setSearchResult(undefined)
            setSearch(router.query.q)
            handleFetchSearch(router.query.q)
        } else {
            router.push('/')
        }
    }, [router.isReady, router.query.q]);

    /* Onclick enter follow up input */
    const onKeyDownFollowUpEnter = useCallback((e) => {
        if(e.key === 'Enter'){
            handleAskFollowUp()
        }
    }, [handleAskFollowUp]);

    /* Check if summary contains code */
    useEffect(() => {
        if(summarizer.isFinished){
            const newSummary = summary.replace(/\n?```([\s\S]*?)```/g, "\n<pre><code>$1</code></pre>");
            setSummary(newSummary)
            summarizer.reset()
        }
    }, [summarizer.isFinished, summarizer.reset])

    /* Handle on search input submitted */
    const onSubmitHandlerKeyDown = useCallback((e) => {

        if(search === router.query.q){
            return;
        }

        if(e.key === 'Enter'){
            e.preventDefault()
            setSummary("")
            setSearchResult(undefined)
            setQuestionHistory([])
            setFollowUpSearch('')
            router.push(`/search?q=${search}`)
        }
    }, [search, setSummary, setSearchResult, setQuestionHistory, setFollowUpSearch, router.push])

    const onSubmitHandler = useCallback((e) => {
        if(search === router.query.q){
            return;
        }
        e.preventDefault()
        setSummary("")
        setSearchResult(undefined)
        setQuestionHistory([])
        setFollowUpSearch('')
        router.push(`/search?q=${search}`)
    }, [search, setSummary, setSearchResult, setQuestionHistory, setFollowUpSearch, router.push]);
    //#endregion

    return (
        <div className="max-w-screen-lg m-auto bg-white text-black">
            <Header onSubmitHandlerKeyDown={onSubmitHandlerKeyDown} value={search} setValue={setSearch} onSubmitHandler={onSubmitHandler} />
            <div className="max-w-80 flex flex-row max-md:flex-col">
                <div className="flex-[0.5] w-[50%] p-4 max-md:w-[100%] md:pt-0">
                    <h4 className="font-sans font-bold my-2 text-sm">Summary</h4>
                    {summary ? (
                        <div className="font-serif text-xs leading-5 max-md:w-[100%]" dangerouslySetInnerHTML={{__html: summary}} />
                    ) : <SummarySkeleton />}
                    <div className="flex flex-col max-md:w-[100%]">
                        <h4 className="font-sans font-bold my-2 text-sm mt-6">Sources</h4>
                        {search_result && search_result.response ? search_result.response.data.slice(0, 3).map((a, i) => (
                            <a key={a.url} href={a.url} className={'font-sans my-1 text-xs truncate text-blue-500 hover:underline'}>{`${i+1}. ${a.url}\n`}</a>
                        )) : <SourcesSkeleton />}
                    </div>
                    {summary && search_result && (
                        <div className="flex justify-center mt-5">
                            <div className="mb-3 w-full">
                                <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                                <input
                                    type="text"
                                    className="relative font-serif m-0 block w-[1%] min-w-0 flex-auto rounded border border-solid border-neutral-600 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary-600 focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
                                    placeholder="Ask follow up question"
                                    value={followUpSearch}
                                    onChange={e => setFollowUpSearch(e.target.value)}
                                    onKeyDown={onKeyDownFollowUpEnter}
                                />
                                <span
                                    onClick={() => handleAskFollowUp()}
                                    className="input-group-text cursor-pointer flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-200"
                                    id="basic-addon2">
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-5 w-5">
                                    <path
                                        fillRule="evenodd"
                                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                        clipRule="evenodd" />
                                    </svg>
                                </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-[0.5] w-[50%] p-4 max-md:w-[100%] max-md:pt-0">
                    {search_result && search_result.response ? search_result.response.data.slice((currPage - 1) * 7, currPage * 7).map(a => (
                        <div key={a.url} className="flex flex-col my-2">
                            <p className="text-xs text-green-500 font-sans">{a.domain}</p>
                            <h4 onClick={() => router.push(a.url)} className="cursor-pointer font-sans text-base font-bold hover:underline">{a.title}</h4>
                            <p className="text-xs font-serif text-gray-400">{a.snippet}</p>
                        </div>
                    )) : <SearchSkeleton />}
                    {search_result && search_result.response && <SearchPagination paginationRef={paginationRef} totalPage={totalPage} setTotalPage={setTotalPage} currPage={currPage} setCurrPage={setCurrPage} />}
                </div>
            </div>
        </div>
    )
})

export default search
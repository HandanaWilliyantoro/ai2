import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router"

import SummarySkeleton from "@/components/SummarySkeleton";
import Header from "@/components/Header";
import SourcesSkeleton from "@/components/SourcesSkeleton";
import SearchSkeleton from "@/components/SearchSkeleton";

import getSearch from "@/stores/Search.store";
import summarizer from "@/stores/Summarize.store";
import { observer } from "mobx-react-lite";

const search = observer(() => {
    const [summary, setSummary] = useState("");
    const [currPage, setCurrPage] = useState(1)
    const [search_result, setSearchResult] = useState()

    //#region HOOKS
    const router = useRouter()
    //#endregion

    
    //#region FETCH SUMMARIZER
    /* Execute */
    const handleFetchSummarizer = useCallback((val) => {
        console.log(val.summaryContent.slice(0, 3), 'ni valuenya ya')
        const params = {
            q: router.query.q,
            summaryContent: val.summaryContent
        }
        summarizer.execute(params)
    }, [router.query.q]);
    
    /* Watcher */
    useEffect(() => {
        if(summarizer.response){
            const response = JSON.parse(JSON.stringify(summary))
            setSummary(`${response + summarizer.response}`)
            summarizer.reset()
        } else if (summarizer.error) {
            console.log(summarizer.error)
            summarizer.reset()
        }
    }, [summarizer.response, summarizer.error, summarizer.reset])
    //#endregion
    
    //#region FETCH SEARCH RESULTS
    const handleFetchSearch = useCallback(() => {
        getSearch.execute({q: router.query.q})
    }, [router.query.q]);

    /* Watcher */
    useEffect(() => {
        if(getSearch.response){
            setSearchResult(getSearch.response)
            handleFetchSummarizer(getSearch.response)
            getSearch.reset()
        } else if (getSearch.error) {
            console.log(getSearch.error)
            getSearch.reset()
        }
    }, [getSearch.response, getSearch.error, getSearch.reset])
    //#endregion

    //#region HANDLER
    /* Component Did Mount */
    useEffect(() => {
        if(router.query.q){
            handleFetchSearch()
            setSummary("")
            setSearchResult(undefined)
        }
    }, [router.query.q]);

    /* Check if summary contains code */
    useEffect(() => {
        if(summarizer.isFinished){
            const newSummary = summary.replace(/```(.*?)```/g, '```$1```');
            setSummary(newSummary)
            console.log(newSummary, 'ini new summary')
        }
    }, [summarizer.isFinished, summary])
    //#endregion

    return (
        <div className="max-w-screen-lg m-auto">
            <Header />
            <div className="max-w-80 flex flex-row max-md:flex-col">
                <div className="flex-[0.5] w-[50%] p-4 max-md:w-[100%]">
                    <h4 className="font-sans font-bold my-2 text-sm">Summary</h4>
                    {summary ? (
                        <p className="font-serif text-xs leading-5 max-md:w-[100%]">{summary}</p>
                    ) : <SummarySkeleton />}
                    <div className="flex flex-col max-md:w-[100%]">
                        <h4 className="font-sans font-bold my-2 text-sm mt-6">Sources</h4>
                        {search_result && search_result.response ? search_result.response.data.slice(0, 3).map((a, i) => (
                            <a key={a.url} href={a.url} className={'font-sans my-1 text-xs truncate text-blue-500 hover:underline'}>{`${i+1}. ${a.url}\n`}</a>
                        )) : <SourcesSkeleton />}
                    </div>
                </div>
                <div className="flex-[0.5] w-[50%] p-4 max-md:w-[100%] max-md:pt-0">
                    {search_result && search_result.response ? search_result.response.data.slice((currPage - 1) * 5, currPage*5).map(a => (
                        <div key={a.domain} className="flex flex-col my-2">
                            <p className="text-xs text-green-500 font-sans">{a.domain}</p>
                            <h4 onClick={() => router.push(a.url)} className="cursor-pointer font-sans text-base font-bold hover:underline">{a.title}</h4>
                            <p className="text-xs font-serif text-gray-400">{a.snippet}</p>
                        </div>
                    )) : <SearchSkeleton />}
                </div>
            </div>
        </div>
    )
})

export async function getServerSideProps (context) {
    if(context.query.q){
        return {
            props: {
                q: context.query.q
            }
        }
    } else {
        return {
            redirect: {
                destination: '/',
            },
        }
    }
}

export default search
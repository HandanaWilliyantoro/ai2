import React, {useState, useCallback, useEffect} from 'react'
import Header from '@/components/Header'
import { useRouter } from 'next/router'
import getDonations from '@/stores/FetchDonation.store'
import { observer } from 'mobx-react-lite'
import { showErrorSnackbar } from '@/util/toast'
import Loading from '@/components/Loading'
import {VscPerson} from 'react-icons/vsc'

const Sponsor = observer(() => {
  const [sponsors, setSponsors] = useState([]);

  const router = useRouter()

  //#region FETCH DONATION
  const handleFetchDonation = useCallback(() => {
    getDonations.execute()
  }, [])

  /* Watcher */
  useEffect(() => {
    if(getDonations.response){
      setSponsors(getDonations.response)
      getDonations.reset()
    } else if (getDonations.error) {
      showErrorSnackbar(getDonations.error)
      getDonations.reset()
    }
  }, [getDonations.response, getDonations.error, getDonations.reset])
  //#endregion

  //#region HANDLER
  useEffect(() => {
    handleFetchDonation()
  }, [])
  //#endregion

  return (
    <div className='h-screen flex flex-col items-start justify-start border-x-2 max-w-screen-md overflow-y-scroll m-auto p-4'>
        <Header />
        <div className='w-full flex flex-col items-center justify-center h-screen py-12 max-md:py-8'>
          <p className='text-center font-bold font-serif text-3xl'>We couldn't do it without you.<br/><span className='text-sm text-gray-500'>Thank you for your generosity</span></p>
          <button onClick={() => router.push('/donate')} className='text-xs animate-pulse font-bold tracking-wider py-2 px-4 mt-4 rounded transition hover:opacity-70 outline-none font-serif text-white bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 text-transparent'>Donate</button>
        </div>
        <div className='flex flex-row flex-wrap w-full items-start justify-center'>
          {sponsors.length > 0 ? (
           sponsors.map(a => (
            <div key={a._id} className='flex flex-row p-3 rounded m-2 border-2 w-[45%] items-center justify-start max-md:w-full'>
              {a.image ? (
                <img className='w-[90px] h-[90px] object-cover rounded' src={a.image} alt='Sponsor image' />
              ) : (
                <VscPerson className='w-[90px] h-[90px] object-cover' />
              )}
              <div className='flex flex-col items-start justify-center ml-4 flex-[0.8] h-full'>
                <p className='text-sm font-bold font-sans w-[150px] truncate'>{a.name}</p>
                <p className='text-xs font-serif w-[150px] my-2 truncate'>Rp. {a.amount}</p>
                <p className='text-xs font-serif w-[150px] truncate'>{a.message}</p>
              </div>
            </div>
           )) 
          ) : getDonations.loading ? (
            <div>
              <Loading />
            </div>
          ) : (
            <div className='h-full flex items-center justify-center'>
              <p className='font-serif text-sm font-bold text-center'>There hasn't been any donations</p>
            </div>
          )}
          {/* <p className='text-xs hover:underline cursor-pointer w-full text-center py-3 font-serif'>See all sponsors {'>>'}</p> */}
        </div>
    </div>
  )
})

export default Sponsor
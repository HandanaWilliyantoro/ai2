import {SiTiktok, SiInstagram} from 'react-icons/si'
import { useCallback } from 'react'

const SocialMedia = () => {

  const onClickSocialMedia = useCallback((url) => {
    window.open(url, '_blank')
  }, [])

  return (
    <div className='flex flex-row items-center mt-4'>
      <SiTiktok onClick={() => onClickSocialMedia('https://www.tiktok.com/@handanawilli')} className='mx-2 cursor-pointer' /> 
      <SiInstagram onClick={() => onClickSocialMedia('https://www.instagram.com/handanawilli')} className='mx-2 cursor-pointer' />
    </div>
  )
}

export default SocialMedia
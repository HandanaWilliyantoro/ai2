import React from 'react'
import ReactLoading from 'react-loading';

const Loading = ({text}) => {
  return (
    <div className='flex flex-col w-full h-full mb-0 items-center justify-center'>
      <ReactLoading type='bubbles' color={'#939393'} height={'auto'} width={50} />
      {text && <p className='font-serif font-bold text-xs pt-1 text-gray-400'>{text}</p>}
    </div>
  )
}

export default Loading
import React from 'react'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import Modal from 'react-modal'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '360px',
      padding: '0px'
    },
};

const ModalUserPlugin = ({
    isOpen,
    onRequestClose,
    plugins,
    onSelectPlugin
}) => {
    return (
        <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='flex flex-row items-center justify-between w-full border-b-2 border-b-gray-200 bg-white p-2'>
                <p className='font-sans text-black font-bold text-sm'>Plugin Mode <span className='py-0.5 ml-0.5 text-xs text-blue-600 font-sans bg-blue-200 px-2 rounded'>Beta</span></p>
                <AiOutlineCloseCircle onClick={onRequestClose} className='w-4 h-5 text-black cursor-pointer transition hover:opacity-50' />
            </div>
            <div className='flex flex-col w-full items-start justify-start max-h-[60vh] p-2 overflow-y-scroll'>
                {plugins && plugins.map((a, i) => (
                    <div key={i} className='flex flex-row items-center justify-start w-full py-2 pr-2'>
                        <img src={a.icon} className='w-12 h-12 object-cover rounded' />
                        <div className='py-2 px-3 max-w-[300px]'>
                            <p className='text-sm font-bold font-serif mb-1 text-black'>{a.name}</p>
                            <p className='text-xs text-gray-500 font-sans my-1'>{a.desc}</p>
                        </div>
                        <input onClick={() => onSelectPlugin(a)} className='cursor-pointer ml-auto checked:before:bg-white accent-white' type={'checkbox'} checked={a.selected} />
                    </div>
                ))}
            </div>
            <div className='flex flex-row items-center p-2 justify-between border-t-2'>
                <p className='text-xs font-serif text-black'>Selected Plugin:</p>
                <p className='text-xs font-serif text-black font-bold'>{plugins?.find(a => a.selected)?.name ?? '-'}</p>
            </div>
        </Modal>
    )
}

export default ModalUserPlugin
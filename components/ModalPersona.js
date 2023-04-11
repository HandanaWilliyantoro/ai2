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
      minWidth: '320px',
      padding: '0px'
    },
};

const ModalPersona = ({
    isOpen,
    onRequestClose,
    persona,
    onSelectPersona
}) => {
    return (
        <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='flex flex-row items-center justify-between w-full border-b-2 border-b-gray-200 bg-white p-2'>
                <p className='font-sans text-black font-bold text-sm'>Select Persona</p>
                <AiOutlineCloseCircle onClick={onRequestClose} className='w-4 h-5 text-black cursor-pointer transition hover:opacity-50' />
            </div>
            <div className='flex flex-col w-full items-start justify-start max-h-[60vh] p-2 overflow-y-scroll'>
                {persona && persona.map((a, i) => (
                    <div key={i} className='flex flex-row items-center justify-start w-full py-2 pr-2'>
                        <input onClick={() => onSelectPersona(a)} className='cursor-pointer checked:before:bg-white accent-white' type={'checkbox'} checked={a.selected} />
                        <div className='ml-4 max-w-[300px]'>
                            <p className='text-sm font-bold font-serif mb-1 text-black'>{a.title}</p>
                            <p className='text-xs text-gray-500 font-sans my-1'>{a.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    )
}

export default ModalPersona
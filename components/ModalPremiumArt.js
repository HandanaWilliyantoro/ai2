import React from 'react'
import Modal from 'react-modal'
import ModalOffer from '../util/assets/modal_offer.png'
import {AiOutlineCheckCircle} from 'react-icons/ai'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    padding: '0px',
    width: '100%',
    maxWidth: '380px'
  },
};

const ModalPremiumArt = ({
    isOpen,
    onRequestClose,
    options,
    onClickUnlockPremium
}) => {
    return (
        <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='text-black flex flex-row items-center justify-center w-full max-md:w-full max-md:flex-col max-md:h-auto'>
                <div className='text-black flex flex-col items-start w-full justify-start p-4'>
                    <p className='text-black font-bold font-serif text-left text-base'>Unlock exclusive access to over 50+ art generator models.</p>
                    <p className='text-black font-serif text-left text-xs mt-2 leading-5'>
                        Our AI-powered art generator allows you to create stunning and unique artworks with over <br/><span className='text-black font-bold'>50+ available models</span> in a matter of seconds. 
                    </p>
                    <div className='text-black flex flex-col items-start justify-start mb-auto mt-1 w-full'>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Available when demand is high</p>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Priority access to new features</p>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Unlock over 50+ art generator model</p>
                        <select placeholder='See all models' className='text-black text-xs w-full border-gray-400 rounded border-2 bg-white outline-none py-2 mt-2'>
                            {options && options.length > 0 && options.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <p className='text-black font-bold font-sans text-sm ml-auto mb-1.5 mt-8'>IDR 50.000 / mo</p>
                    <button onClick={onClickUnlockPremium} className='font-serif bg-black w-full text-white text-xs px-4 py-2 rounded text-transparent animate-text bg-gradient-to-r from-yellow-600 via-pink-600 to-blue-600'>Unlock extra 50+ models & unlimited access</button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalPremiumArt
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
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px',
  },
};

const ModalPremiumArt = ({
    isOpen,
    onRequestClose,
    options
}) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='text-black flex flex-row items-center justify-center w-full max-md:flex-col h-[380px] max-md:h-auto max-md:w-[90vw]'>
                <img src={ModalOffer.src} className='text-black w-[350px] object-center h-[380px] max-md:w-full' alt='being good' />
                <div className='text-black flex flex-col items-start w-[350px] h-[380px] mx-4 justify-start py-6'>
                    <p className='text-black font-bold font-serif text-left text-base'>Experience art like never before with our unlimited AI-powered art generator.</p>
                    <p className='text-black font-serif text-left text-xs mt-2 leading-6'>
                        Our AI-powered art generator allows you to create stunning and unique artworks with over <br/><span className='text-black font-bold'>50+ available models</span> in a matter of seconds. 
                    </p>
                    <div className='text-black flex flex-col w-full items-start justify-start mb-auto mt-1'>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Available when demand is high</p>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Priority access to new features</p>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Unlock over 50+ art generator model</p>
                        <select placeholder='See all models' className='text-black text-xs w-full border-gray-400 rounded border-2 outline-none py-1 mt-1.5'>
                            {options && options.length > 0 && options.map(a => <option value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <p className='text-black font-bold font-sans text-sm ml-auto mb-1'>IDR 50.000 / mo</p>
                    <button className='text-black font-serif bg-black w-full text-white text-xs px-4 py-2 rounded text-transparent animate-text bg-gradient-to-r from-yellow-600 via-pink-600 to-blue-600'>Unlock extra 50+ models & unlimited access</button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalPremiumArt
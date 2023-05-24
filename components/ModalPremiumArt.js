import React from 'react'
import Modal from 'react-modal'
import {AiOutlineCheckCircle} from 'react-icons/ai'
import PaypalButton from './PaypalButton';

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
    onClickUnlockPremium,
    setSelectedCurrency,
    selectedCurrency,
    handleIntlPayment
}) => {
    return (
        <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='text-black flex flex-row items-center overflow-y-scroll max-h-[90vh] justify-center w-full max-md:w-full max-md:flex-col max-md:h-auto'>
                <div className='text-black flex flex-col items-start w-full justify-start p-4'>
                    <p className='text-black font-bold font-serif text-left text-base'>Unlock exclusive access to over 50+ art generator models.</p>
                    <p className='text-black font-serif text-left text-xs mt-2 leading-5'>
                        Our AI-powered art generator allows you to create stunning and unique artworks with over <br/><span className='text-black font-bold'>50+ available models</span> in a matter of seconds. 
                    </p>
                    <div className='text-black flex flex-col items-start justify-start mb-auto mt-1 w-full'>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />No more ads: premium plan, pure content.</p>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Priority access to new features</p>
                        <p className='text-black flex flex-row font-serif text-xs items-center justify-start mt-3'><AiOutlineCheckCircle className='text-green-600 mr-1' />Unlock over 60+ art generator model</p>
                        <select placeholder='See all models' className='text-black text-xs w-full border-gray-400 rounded border-2 bg-white outline-none py-2 mt-2'>
                            {options && options.length > 0 && options.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </div>
                    <div className='flex flex-row items-end justify-between w-full mb-1.5'>
                        <select onChange={(e) => setSelectedCurrency(e.target.value)} className='border cursor-pointer border-black rounded font-serif outline-none text-xs pr-1 py-0.5'>
                            <option value={'USD'}>USD</option>
                            <option value={'IDR'}>IDR</option>
                        </select>
                        <p className='text-black font-bold font-sans text-sm ml-auto mt-8'>{selectedCurrency === 'IDR' ? 'Rp 50.000 / month' : '$5 / month'}</p>
                    </div>
                    {selectedCurrency === 'IDR' ? (
                        <button onClick={onClickUnlockPremium} className='font-serif bg-black w-full text-white text-xs px-4 py-2 rounded text-transparent animate-text bg-gradient-to-r from-yellow-600 via-pink-600 to-blue-600'>Unlock extra mode</button>
                    ): (
                        <div className='w-full mt-1'>
                            <PaypalButton amount={5} handleIntlPayment={handleIntlPayment} />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default ModalPremiumArt
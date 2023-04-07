import React from 'react'
import Modal from 'react-modal'
import Grateful from '../util/assets/grateful.png'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '320px',
    padding: '0px',
    maxWidth: '400px'
  },
};

const ModalDonationSuccess = ({
    isOpen,
    onRequestClose
}) => {
  return (
    <Modal isOpen={isOpen} closeTimeoutMS={5000} style={customStyles}>
      <div className='flex flex-col items-center justify-center w-full p-4'>
        <img className='w-[150px] h-[150px] object-contain' src={Grateful.src} alt='feeling grateful' />
        <p className='text-sm text-gray-600 font-serif text-center w-full mt-2'>Thank you for your generous contribution!</p>
      </div>
    </Modal>
  )
}

export default ModalDonationSuccess
import React, {useCallback, useState} from 'react'
import Modal from 'react-modal'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import { showErrorSnackbar } from '@/util/toast';

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

const services = [
    {
        label: 'Email',
        value: 'email'
    },
    {
        label: 'Whatsapp',
        value: 'whatsapp'
    },
]

const ModalSend = ({
    isOpen,
    onRequestClose,
    data,
    setSelectedAction
}) => {
    //#region STATE
    const [selected, setSelected] = useState('email');

    //#region EMAIL
    const [sendEmailTo, setSendEmailTo] = useState('');
    const [emailSubject, setEmailSubject] = useState('');

    //#region WHATSAPP
    const [waNumber, setWaNumber] = useState('');
    //#endregion

    //#region SUBMIT
    const onSubmitEmail = useCallback(() => {
        if(!sendEmailTo){
            showErrorSnackbar('Send email field is required');
            return;
        }

        if(!emailSubject){
            showErrorSnackbar('Email subject field is required')
            return;
        }

        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if(!regex.test(sendEmailTo)){
            showErrorSnackbar('Invalid email format')
            return
        }

        if(!data){
            showErrorSnackbar('Body field is required')
            return
        }

        var link = `mailto:${sendEmailTo}`
             + "?subject=" + encodeURIComponent(emailSubject)
             + "&body=" + encodeURIComponent(data)
        ;
        
        window.open(link, '_blank');
    }, [sendEmailTo, emailSubject, data]);

    const onSubmitWa = useCallback(() => {
        if(!waNumber){
            showErrorSnackbar('Whatsapp number field is required')
            return
        }

        if(!data){
            showErrorSnackbar('Body field is required')
            return;
        }

        waNumber.replace('+', '')

        const regex = /^62[1-9]\d{7,10}$/;

        if(!regex.test(waNumber)){
            showErrorSnackbar('Invalid whatsapp number');
            return;
        }

        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(data)}`, '_blank')

    }, [waNumber, data]);
    //#endregion

    //#region HANDLER
    const onSelect = useCallback((val) => {
        setSelected(val)
    }, []);

    const renderForm = useCallback(() => {
        switch(selected){
            case 'email':
                return (
                    <div className='flex flex-col w-full items-start justify-start'>
                        <div className='flex flex-col items-start justify-start w-full my-1'>
                            <label className='font-serif text-black bg-white ml-1 text-xs mb-1'>Send email to</label>
                            <input type='email' value={sendEmailTo} onChange={e => setSendEmailTo(e.target.value)} className='font-serif text-black bg-white text-xs py-2 px-1 outline-none rounded border-2 w-full' placeholder='example@gmail.com' />
                        </div>
                        <div className='flex flex-col items-start justify-start w-full my-1'>
                            <label className='font-serif text-black bg-white ml-1 text-xs mb-1'>Subject</label>
                            <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className='font-serif text-black bg-white text-xs py-2 px-1 outline-none rounded border-2 w-full' placeholder='Enter subject here' />
                        </div>
                        <div className='flex flex-col items-start justify-start w-full my-1'>
                            <label className='font-serif text-black bg-white ml-1 text-xs mb-1'>Body</label>
                            <textarea onChange={e => setSelectedAction(e.target.value)} value={data} className='font-serif text-black bg-white resize-none h-[100px] text-xs py-2 px-1 outline-none rounded border-2 w-full' placeholder='example@gmail.com' />
                        </div>
                        <button onClick={onSubmitEmail} className='w-full py-2 bg-black text-white border rounded mt-2 border-black transition text-xs font-serif hover:bg-white hover:text-black'>Send Email</button>
                    </div>
                );
            case 'whatsapp':
                return (
                    <div className='flex flex-col w-full items-start justify-start'>
                        <div className='flex flex-col items-start justify-start w-full my-1'>
                            <label className='font-serif text-black bg-white ml-1 text-xs mb-1'>Whatsapp Number</label>
                            <input value={waNumber} onChange={e => setWaNumber(e.target.value)} className='font-serif text-black bg-white text-xs py-2 px-1 outline-none rounded border-2 w-full' placeholder='example: 62856123456' />
                        </div>
                        <div className='flex flex-col items-start justify-start w-full my-1'>
                            <label className='font-serif text-black bg-white ml-1 text-xs mb-1'>Body</label>
                            <textarea onChange={e => setSelectedAction(e.target.value)} value={data} className='font-serif text-black bg-white resize-none h-[100px] text-xs py-2 px-1 outline-none rounded border-2 w-full' placeholder='example@gmail.com' />
                        </div>
                        <button onClick={onSubmitWa} className='w-full py-2 bg-black text-white border rounded mt-2 border-black transition text-xs font-serif hover:bg-white hover:text-black'>Send Whatsapp</button>
                    </div>
                )
        }
    }, [selected, data, sendEmailTo, emailSubject, waNumber, isOpen])
    //#endregion

    return (
        <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='flex flex-col items-start justify-start w-full'>
                <div className='border-b-2 w-full flex flex-row items-center justify-between'>
                    <p className='text-sm text-black font-bold p-2 ml-1'>Send Panel</p>
                    <AiOutlineCloseCircle onClick={onRequestClose} className='w-4 h-5 mr-2 text-black cursor-pointer transition hover:opacity-50' />
                </div>
                <div className='flex flex-col items-start justify-start p-2 w-full'>
                    <label className='font-sans text-xs mb-1 ml-1 text-black'>Application</label>
                    <select className='outline-none border-2 bg-white text-black font-serif p-1 w-full rounded text-xs cursor-pointer' onChange={(e) => onSelect(e.target.value)} defaultValue={selected} >
                        {services.map(a => (
                            <option key={a.value} className='text-xs font-sans cursor-pointer font-bold my-2' value={a.value}>
                                <div className='flex flex-row items-center justify-start py-2'>
                                    <p>{a.label}</p>
                                </div>
                            </option>
                        ))}
                    </select>
                    <p className='font-bold text-sm py-4 w-full text-center text-black'>Form</p>
                    {renderForm()}
                </div>
            </div>
        </Modal>
    )
}

export default ModalSend
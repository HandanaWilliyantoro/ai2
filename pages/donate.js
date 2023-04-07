import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineArrowLeft, AiOutlineDelete } from 'react-icons/ai'
import { useRouter } from 'next/router'
import {useFormik} from "formik";
import * as Yup from 'yup';
import { observer } from 'mobx-react-lite';
import { useFilePicker } from 'use-file-picker';
import { showErrorSnackbar } from '@/util/toast';
import handleImageUpload from '@/util/image';
import ModalDonationSuccess from '@/components/ModalDonationSuccess';

import donate from '@/stores/Donation.store';

const Donate = observer(() => {
    const [profileImg, setProfileImg] = useState('')
    const [isModalOpened, setIsModalOpened] = useState(false)

    const router = useRouter()

    //#region FILE SELECTOR
    const [
        openImage,
        {
          filesContent: fileImage,
          clear: clearImage,
        },
      ] = useFilePicker({
        readAs: 'DataURL',
        accept: ['.jpg', '.jpeg', '.png'],
        multiple: false,
        limitFilesConfig: {max: 1},
        maxFileSize: 10,
    });
    //#endregion

    //#region UPLOAD IMAGE
    const uploadImage = useCallback(async (file) => {
        const data = await handleImageUpload(file)
        setProfileImg(data.url)
        clearImage()
    }, [clearImage])
  
    /* Watcher */
    useEffect(() => {
    if(fileImage.length){
        uploadImage(fileImage[0].content, 1)
        clearImage()
    }
    }, [clearImage, fileImage, fileImage.length, uploadImage])
    //#endregion

    //#region HANDLE DONATION SUBMIT
    const onSubmit = useCallback(async (val) => {
        const storage = await localStorage.getItem('user')
        const parsed = await JSON.parse(storage)
        const params = {...val, userEmail: parsed.email}
        donate.execute(params)
    }, [])

    useEffect(() => {
        if(donate.response){
            console.log(donate.response);
            setIsModalOpened(true)
            setTimeout(() => {
                router.push('/sponsor')
            }, 5000)
            donate.reset()
        } else if (donate.error) {
            showErrorSnackbar(donate.error)
            donate.reset()
        }
    }, [donate.error, donate.response, donate.reset])
    //#endregion

    //#region FORMIK
    const schema = Yup.object({
        name: Yup.string().required('Name field is required'),
        currency: Yup.string().required('Currency field is required'),
        amount: Yup.number().min(10000, "Donation amount should be more than 10.000").required('Donation amount field is required'),
        message: Yup.string().required('Message field is required'),
        image: Yup.string().optional()
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            currency: 'IDR',
            amount: undefined,
            message: '',
            image: ''
        },
        onSubmit,
        validationSchema: schema,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: false
    });
    //#endregion

    //#region HANDLER
    useEffect(() => {
        formik.setFieldValue('image', profileImg)
    }, [profileImg])
    //#endregion

    return (
        <div className='h-screen flex flex-col items-start justify-start border-x-2 max-w-screen-sm overflow-y-scroll m-auto p-4'>
            {/* Modal Donation Success */}
            <ModalDonationSuccess
                isOpen={isModalOpened}
                onRequestClose={() => setIsModalOpened(!isModalOpened)}
            />
            <div className='flex flex-row items-center justify-start pb-2 mb-2 border-b-2 w-full'>
                <AiOutlineArrowLeft onClick={() => router.back()} className='w-4 h-4 cursor-pointer mr-2' />
                <p className='font-serif text-base font-bold tracking-wider'>Donation Form</p>
            </div>
            <p className='text-xl font-bold font-serif text-left w-full mt-2'>Be a champion for change:<br/>Donate and join our list of sponsors!</p>
            <p className='text-left text-gray-400 font-bold text-xs my-2 w-full'>Make every search count. Donate now to support our AI-powered search engine!</p>
            <div className='w-full flex-[1] h-full flex flex-col items-start justify-start'>
                <div className='w-full flex flex-col my-2 max-md:mb-3 items-start justify-start'>
                    <p className='font-serif text-xs'>Logo / Profile picture (optional)</p>
                    {profileImg ? (
                        <div className='flex flex-row items-start justify-start'>
                            <img onClick={openImage} className='w-[150px] rounded h-[150px] object-cover cursor-pointer transition hover:opacity-50 mt-2' src={profileImg} alt="profile image.." />
                            <AiOutlineDelete onClick={() => setProfileImg('')} className='w-4 h-4 mt-auto ml-1 cursor-pointer transition hover:opacity-50' />
                        </div>
                    ) : (
                        <div onClick={openImage} className='rounded cursor-pointer transition hover:opacity-50 w-[150px] h-[150px] object-cover border-2 border-gray-500 border-dashed flex flex-col items-center justify-center mt-2'>
                            <p className='font-serif text-sm text-black'>Upload Image</p>
                        </div>
                    )}
                    <p className='text-left my-2 text-gray-400 font-serif text-xs'>Recommended Image Size: 150px X 150px (square)</p>
                </div>
                <div className='w-full flex flex-col my-2 max-md:mb-3 items-start justify-start'>
                    <p className='font-serif text-xs'>Full Name</p>
                    <input name='name' value={formik.values.name} onChange={formik.handleChange} className='w-full text-xs p-1 border-2 rounded outline-none' placeholder='Ex: Handana Williyantoro' />
                    <p className='text-red-500 text-xs font-serif mt-1 text-left'>{formik.errors.name ? formik.errors.name : ''}</p>
                </div>
                <div className='w-full flex flex-col my-2 max-md:mb-3 items-start justify-start'>
                    <p className='font-serif text-xs'>Currency</p>
                    <select defaultValue='IDR' disabled name='currency' onChange={e => formik.setFieldValue('currency', e.target.value)} className='w-full text-xs py-1 border-2 rounded outline-none'>
                        <option value='IDR'>IDR</option>
                        <option value="USD">USD</option>
                    </select>
                </div>
                <div className='w-full flex flex-col my-2 max-md:mb-3 items-start justify-start'>
                    <p className='font-serif text-xs'>Donation Amount</p>
                    <input min={10000} type='number' value={formik.values.amount} name='amount' onChange={formik.handleChange} className='w-full text-xs p-1 border-2 rounded outline-none' placeholder='Ex: 15000' />
                    <p className='text-red-500 text-xs font-serif mt-1 text-left'>{formik.errors.amount ? formik.errors.amount : ''}</p>
                </div>
                <div className='w-full flex flex-col my-2 max-md:mb-3 items-start justify-start'>
                    <p className='font-serif text-xs'>Message</p>
                    <textarea onChange={e => formik.setFieldValue('message', e.target.value)} value={formik.values.message} className='w-full text-xs p-1 border-2 resize-none h-[150px] rounded outline-none' placeholder='Ex: Handana Williyantoro' />
                    <p className='text-red-500 text-xs font-serif mt-1 text-left'>{formik.errors.message ? formik.errors.message : ''}</p>
                </div>
                <button type='submit' onClick={formik.handleSubmit} className='w-full mt-3 border tracking-wider font-bold transition hover:bg-white hover:border-gray-700 hover:text-black bg-black text-sm text-white font-sans py-2 rounded'>Submit</button>
                <p onClick={() => router.push('/sponsor')} className='w-full text-center text-xs font-serif py-4 hover:underline cursor-pointer'>See our list of sponsors {'>>'}</p>
            </div>
        </div>
    )
})

export default Donate
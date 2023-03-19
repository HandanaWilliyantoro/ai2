import React, {useCallback, useEffect} from 'react'
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { emailRegExp } from '@/util/regex';
import { showErrorSnackbar, showSuccessSnackbar } from '@/util/toast';

import { observer } from 'mobx-react-lite';
import sendVerification from '@/stores/SendVerification.store';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '320px'
    },
};

const ModalSignUp = observer(({
    isOpen,
    onRequestClose,
    setModalType,
    setSecret,
    setUserData
}) => {

    //#region SEND VERIFICATION
    const onSubmit = useCallback((val) => {
        const params = {
            email: val.email,
            password: val.password
        }

        setUserData(params);
        sendVerification.execute({email: val.email})
    }, [setUserData]);

    /* Watcher */
    useEffect(() => {
        if(sendVerification.response) {
            setModalType('verify');
            localStorage.setItem('secret', sendVerification.response.secret)
            setSecret(sendVerification.response.secret)
            showSuccessSnackbar(sendVerification.response.text)
            sendVerification.reset()
        } else if (sendVerification.error) {
            showErrorSnackbar(sendVerification.error)
            sendVerification.reset()
        }
    }, [sendVerification.response, sendVerification.error, sendVerification.reset])
    //#endregion

    const schema = Yup.object({
        email: Yup.string().matches(emailRegExp, 'Email is not valid').required('email field is required'),
        password: Yup.string()
        .min(6, 'password must be more than 6 characters')
        .matches(/[a-z]+/, 'password must consist of one uppercase letter and one lowercase letter')
        .matches(/[A-Z]+/, 'password must consist of one uppercase letter and one lowercase letter')
        .required('password field is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'confirmation password and password field must match').required('confirmation password field is required'),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
            email: ''
        },
        onSubmit,
        validationSchema: schema,
        validateOnBlur: false,
        validateOnChange: false,
    });

    return (
        <Modal isOpen={isOpen} ariaHideApp={false} onRequestClose={onRequestClose} style={customStyles}>
            <div className='flex flex-col items-start justify-center p-4 bg-white'>
                <h4 className='font-sans text-lg font-bold text-black'>Sign Up</h4>
                <p className='text-xs font-serif text-gray-400 mt-1'>Discover The Power of AI + Search Engine with Handana</p>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col my-5'>
                        <input value={formik.values.email} name="email" onChange={formik.handleChange} type="email" className='pb-1 pt-0 px-2 font-serif pl-0 border-b border-black outline-0 text-xs' placeholder='Email' />
                    </div>
                    <div className='flex flex-col my-5'>
                        <input value={formik.values.password} name="password" onChange={formik.handleChange} type="password" className='pb-1 pt-0 px-2 font-serif pl-0 border-b border-black outline-0 text-xs' placeholder='Password' />
                    </div>
                    <div className='flex flex-col my-5'>
                        <input value={formik.values.confirmPassword} name="confirmPassword" onChange={formik.handleChange} type="password" className='pb-1 pt-0 px-2 font-serif pl-0 border-b border-black outline-0 text-xs' placeholder='Confirm Password' />
                    </div>
                    {formik.errors && <p className='font-serif text-red-500 text-xs mb-2'>{Object.values(formik.errors).toString().replaceAll(',', ', ')}</p>}
                    <button disabled={sendVerification.loading} type="submit" className='bg-black text-white text-xs font-sans py-2 px-4 rounded mt-1'>{sendVerification.loading ? "Loading.." : "Sign Up"}</button>
                </form>
                <p className='mt-3 font-serif text-xs'>Have an account? Click <span onClick={() => setModalType('sign-in')} className='text-blue-500 hover:underline cursor-pointer'>here</span></p>
            </div>
        </Modal>
    )
})

export default ModalSignUp
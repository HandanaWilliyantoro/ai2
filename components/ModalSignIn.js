import React, {useCallback, useEffect} from 'react'
import Modal from 'react-modal';
import {useFormik} from "formik";
import * as Yup from 'yup';
import { emailRegExp } from '@/util/regex';
import { showSuccessSnackbar, showErrorSnackbar } from '@/util/toast';
import { authenticate as formAuthenticate } from '@/util/auth';
import {useSession, signIn as socialSignIn} from "next-auth/react";
import { SiGoogle } from 'react-icons/si';

import signIn from '@/stores/SignIn.store';
import { observer } from 'mobx-react-lite';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '300px'
    },
};

const ModalSignIn = observer(({
    isOpen,
    onRequestClose,
    setModalType,
    setIsAuthenticated,
    isAuthenticated
}) => {

    const {data, status} = useSession();

    //#region GOOGLE SIGN IN
    /* Execute */
    useEffect(() => {
        const expiry = localStorage.getItem('expiry')
        if(status == 'authenticated' && expiry){
            formAuthenticate(data.user, data.accessToken)
            setModalType(undefined)
            setIsAuthenticated(true)
        }
    }, [status, isAuthenticated]);
    //#endregion

    //#region HANDLER
    const onClickGoogleSignIn = useCallback((e) => {
        e.preventDefault();
        socialSignIn('google', {redirect: false})
    }, [socialSignIn])
    //#endregion

    //#region SIGN IN
    const onSubmit = useCallback((val) => {
        const params = {
            email: val.email,
            password: val.password
        }
        signIn.execute(params);
    }, [signIn.execute]);

    /* Watcher */
    useEffect(() => {
        if(signIn.response){
            showSuccessSnackbar('Sign in successfull')
            socialSignIn("credentials", {email: formik.values.email, password: formik.values.password})
            setIsAuthenticated(true)
            formAuthenticate(signIn.response.user, signIn.response.token);
            setModalType(undefined)
            signIn.reset()
        } else if (signIn.error) {
            showErrorSnackbar(signIn.error)
            signIn.reset()
        }
    }, [signIn.error, signIn.response, signIn.reset])
    //#endregion

    const schema = Yup.object({
        email: Yup.string().matches(emailRegExp, 'invalid email').required('email field is required'),
        password: Yup.string()
        .min(6, 'password must contain more than 6 characters')
        .matches(/[a-z]+/, 'password must contain 1 uppercase letter and 1 lowercase letter')
        .matches(/[A-Z]+/, 'password must contain 1 uppercase letter and 1 lowercase letter')
        .required('password field is required'),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            email: ''
        },
        onSubmit,
        validationSchema: schema,
        validateOnBlur: false,
        validateOnChange: false,
    });

    return (
        <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className='flex flex-col items-start justify-center p-4 w-full'>
                <h4 className='font-sans text-lg font-bold text-black text-center w-full'>Sign In to Continue</h4>
                <p className='text-xs font-serif text-gray-400 mt-1 w-full text-center'>Discover The Power of AI + Search Engine with Handana</p>
                <form className='w-full' onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col my-5 w-full'>
                        <input name='email' value={formik.values.email} onChange={formik.handleChange} type="email" className='pb-1 bg-white text-black pt-0 px-2 font-serif pl-0 border-b border-black outline-0 text-xs w-full' placeholder='Email' />
                    </div>
                    <div className='flex flex-col my-5'>
                        <input name="password" value={formik.values.password} onChange={formik.handleChange} type="password" className='pb-1 text-black bg-white pt-0 px-2 font-serif pl-0 border-b border-black outline-0 text-xs' placeholder='Password' />
                    </div>
                    {formik.errors && <p className='font-serif text-red-500 text-xs mb-2'>{Object.values(formik.errors).toString().replaceAll(',', ', ')}</p>}
                    <button disabled={signIn.loading} type='submit' className='bg-black w-full text-white text-xs font-sans py-2 px-4 rounded'>{signIn.loading ? "Loading.." : "Sign In"}</button>
                    <p className='font-sans text-xs my-3 w-full text-center text-black'>Or</p>
                </form>
                <button className='font-serif text-xs text-black rounded mb-3 flex flex-row justify-center items-center border-black w-full border py-2' onClick={onClickGoogleSignIn}><SiGoogle className='w-3 h-3 mr-2' /> Continue with Google</button>
                <p className='mt-3 w-full text-black text-center font-serif text-xs'>Don't have an account? Click <span onClick={() => setModalType('sign-up')} className='text-blue-500 hover:underline cursor-pointer'>here</span></p>
            </div>
        </Modal>
    )
})

export default ModalSignIn
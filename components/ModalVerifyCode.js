import React, {useState, useCallback, useEffect} from 'react'
import Modal from 'react-modal';
import {BiArrowBack} from 'react-icons/bi'
import ReactInputVerificationCode from 'react-input-verification-code';
import { showSuccessSnackbar, showErrorSnackbar } from '@/util/toast';
import { authenticate } from '@/util/auth';
import signUp from '@/stores/SignUp.store';
import verifyEmail from '@/stores/VerifyEmail.store';
import { observer } from 'mobx-react-lite';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

const ModalVerifyCode = observer(({
    isOpen,
    onRequestClose,
    secret,
    setModalType,
    userData,
    setIsAuthenticated
}) => {
  const [confirmationCode, setConfirmationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  //#region SIGN UP
  const onSubmitSignUp = useCallback(() => {
    signUp.execute(userData);
  }, [userData]);

  /* Watcher */
  useEffect(() => {
    if(signUp.response){
      setIsLoading(false)
      setModalType(undefined)
      setIsAuthenticated(true)
      showSuccessSnackbar('Sign up successfull')
      authenticate(signUp.response.user, signUp.response.token);
      signUp.reset();
    } else if (signUp.error) {
      setIsLoading(false)
      showErrorSnackbar(signUp.error)
      signUp.reset();
    }
  }, [signUp.reset, signUp.response, signUp.error])
  //#endregion

  //#region VERIFY EMAIL
  const onSubmit = useCallback(() => {
    setIsLoading(true)
    if(secret && confirmationCode){
      verifyEmail.execute({confirmationCode, secret});
    } else {
      const userSecret = localStorage.getItem('secret')
      verifyEmail.execute({secret: userSecret, confirmationCode})
    }
  }, [secret, confirmationCode]);

  /* Watcher */
  useEffect(() => {
    if(verifyEmail.response){
      localStorage.clear();      
      onSubmitSignUp()
      verifyEmail.reset();
    } else if (verifyEmail.error) {
      setIsLoading(false)
      showErrorSnackbar(verifyEmail.error)
      verifyEmail.reset()
    }
  }, [verifyEmail.response, verifyEmail.reset, verifyEmail.error])
  
  //#endregion

  return (
    <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
        <div className='flex flex-col items-start justify-center p-4 py-1'>
            <div className='flex flex-row items-center justify-between py-2 w-full'>
                <BiArrowBack onClick={() => setModalType('sign-up')} width={45} height={45} className='cursor-pointer' />
                <p className='font-sans text-base text-center mx-auto font-bold'>Verify your email</p>
            </div>
            <p className='text-xs text-center font-serif w-full py-2 text-gray-500'>Verification code has been sent to <br/><span className='font-bold'>{userData?.email}</span></p>
            <div className='my-4 '>
              <ReactInputVerificationCode
                placeholder={0}
                length={4}
                type={'text'}
                onChange={e => setConfirmationCode(e)}
                autoFocus
              />
            </div>
            <button disabled={isLoading} onClick={onSubmit} className='bg-black text-sm font-sans text-white py-2 w-full rounded border transition hover:border-black hover:text-black hover:bg-white'>{isLoading ? "Loading.." : "Submit verification code"}</button>
        </div>
    </Modal>
  )
})

export default ModalVerifyCode
import Modal from 'react-modal';
import {AiOutlineCloseSquare} from 'react-icons/ai'
import { useEffect } from 'react';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '0px',
      width: '100%',
      maxWidth: '420px',
      maxHeight: '90vh'
    },
  };

export default function ModalPopupOnGenerate({isOpen, onRequestClose})  {

    useEffect(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.log(err);
        }
    }, []);

    return (
        <Modal style={customStyles} isOpen={isOpen} onRequestClose={() => window.open(`//pl19449495.highrevenuegate.com/${atOptions.key}/invoke.js`)}>
            <AiOutlineCloseSquare className='ml-auto w-5 h-5 mr-1 mt-1 cursor-pointer' onClick={onRequestClose} />
            <ins 
                className="adsbygoogle"
                style={{display: 'block'}}
                data-ad-client="ca-pub-6332345664092406"
                data-ad-slot="2868091900"
                data-ad-format="auto"
                data-full-width-responsive="true" 
            />
        </Modal>
    )
}
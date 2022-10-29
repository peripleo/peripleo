import React, { useEffect, EventHandler } from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';

export type InfoModalProps = {

  popup: React.ReactElement

  onClose: EventHandler<any>;
  
}

export const InfoModal = (props: InfoModalProps) => {

  useEffect(() => {
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape')
        props.onClose(null);
    }

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return ReactDOM.createPortal(
    <div className="p6o-info-modal-bg">
      <button
        className="p6o-info-modal-close"
        onClick={props.onClose}>

        <IoCloseOutline />

      </button>
      
      {props.popup}
    </div>,

    document.body
  )

}
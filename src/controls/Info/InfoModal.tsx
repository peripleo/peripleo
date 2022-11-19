import React, { useEffect, EventHandler } from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';

export type InfoModalProps = {

  children: React.ReactElement

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
    <div className="p6o-info-modal-bg" onClick={props.onClose}>
      <button
        className="p6o-info-modal-close"
        onClick={props.onClose}>

        <IoCloseOutline />

      </button>
      
      {props.children}
    </div>,

    document.body
  )

}
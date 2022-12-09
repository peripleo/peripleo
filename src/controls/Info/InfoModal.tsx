import React, { useEffect, useRef, EventHandler } from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';

export type InfoModalProps = {

  children: React.ReactElement

  className?: string

  onClose: EventHandler<any>
  
}

export const InfoModal = (props: InfoModalProps) => {

  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape')
        props.onClose(null);
    }

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const onClick = (evt: React.MouseEvent) => {
    if (evt.target === el.current)
      props.onClose(evt);
  }

  return ReactDOM.createPortal(
    <div 
      ref={el}
      className={props.className ? `p6o-info-modal-bg ${props.className}` : 'p6o-info-modal-bg'} 
      onClick={onClick}>
      <button
        className="p6o-info-modal-close"
        onClick={props.onClose}>

        <IoCloseOutline />

      </button>
      
      <main className="p6o-info-modal-main">
        {props.children}
      </main>
    </div>,

    document.body
  )

}
import React, { useEffect, useRef, EventHandler } from 'react';
import ReactDOM from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import { Size, useDeviceState } from '../../device';

export type InfoModalProps = {

  children: React.ReactElement

  className?: string

  onClose: EventHandler<any>
  
}

export const InfoModal = (props: InfoModalProps) => {

  const el = useRef<HTMLDivElement>(null);

  const device = useDeviceState();

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
        className={device.size === Size.DESKTOP ? 'p6o-info-modal-close' : 'p6o-info-modal-close mobile'}
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
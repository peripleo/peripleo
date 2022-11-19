import React, { useState } from 'react';
import { IoInformation } from 'react-icons/io5';
import { InfoModal } from './InfoModal';

import './InfoControl.css';

export type InfoProps = {

  children: React.ReactElement

}

export const InfoControl = (props: InfoProps) => {

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button 
        className="p6o-controls-btn p6o-info"
        tabIndex={41}
        aria-label="Information"
        onClick={() => setModalOpen(true)}>
        <IoInformation />
      </button>

      {modalOpen && (
        <InfoModal
          onClose={() => setModalOpen(false)}>
          {props.children}
        </InfoModal>
      )}
    </>
  )

}
import React from 'react';
import { FiMenu } from 'react-icons/fi';

import './MobileMenu.css';

export const MobileMenu = () => {

  return (
    <button 
      className="p6o-controls-btn p6o-mobile-menu"
      tabIndex={42}
      aria-label="Open menu">
      <FiMenu />
    </button>
  )

}
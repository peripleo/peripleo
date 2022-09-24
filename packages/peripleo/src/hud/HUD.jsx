import React from 'react';

import './HUD.css';

export const HUD = props => {

  return (
    <div className='p6o-hud-container'>
      {props.children}
    </div>
  )

}
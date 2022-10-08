import React from 'react';

import './Controls.css';

export const Controls = (props: { children: React.ReactElement }) => {

  return (
    <div className='p6o-controls-container'>
      {props.children}
    </div>
  )

}
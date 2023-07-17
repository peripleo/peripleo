import React from 'react';

import './Controls.css';

export const Scrollable = (props: { children: React.ReactElement }) => {

  return (
    <div className='p6o-scrollable-container'>
      {props.children}
    </div>
  )

}
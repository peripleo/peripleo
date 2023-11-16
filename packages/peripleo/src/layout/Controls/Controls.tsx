import { ReactNode } from 'react';

import './Controls.css';

interface ControlsProps {

  position?: 'topright' | 'topleft';

  children: ReactNode;

}

export const Controls = (props: ControlsProps) => {

  const { position } = props;

  return (
    <div className={position ? `p6o-controls-container ${position}` : 'p6o-controls-container'}>
      {props.children}
    </div>
  )

}
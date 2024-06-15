import { ReactNode } from 'react';
import { useMap } from '../../map';

import './ZoomControl.css';

interface ZoomControlProps {

  zoomIn?: ReactNode;

  zoomOut?: ReactNode;

}

export const ZoomControl = (props: ZoomControlProps) => {

  const map = useMap();

  const onZoom = (inc: number) => () =>
    map.easeTo({ zoom:  map.getZoom() + inc });
  
  return (
    <div className="p6o-zoom">
      <button 
        className="p6o-control p6o-control-btn p6o-zoom-in"
        aria-label="Zoom in"
        onClick={onZoom(1)}>
        {props.zoomIn || <span>+</span>}
      </button>

      <button 
        className="p6o-control p6o-control-btn p6o-zoom-out"
        aria-label="Zoom out"
        onClick={onZoom(-1)}>
        {props.zoomOut || <span>-</span>}
      </button>
    </div>
  )

}
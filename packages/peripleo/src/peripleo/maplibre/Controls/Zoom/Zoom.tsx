import { Minus, Plus } from '@phosphor-icons/react';
import { useMap } from '../../Map';

import './Zoom.css';

export const Zoom = () => {

  const map = useMap();

  const onZoom = (inc: number) => () => {
    map.easeTo({ zoom:  map.getZoom() + inc });
  }
  
  return (
    <div className="p6o-zoom">
      <button 
        className="p6o-control p6o-control-btn p6o-zoom-in"
        aria-label="Zoom in"
        onClick={onZoom(1)}>
        <Plus size={20} />
      </button>

      <button 
        className="p6o-control p6o-control-btn p6o-zoom-out"
        aria-label="Zoom out"
        onClick={onZoom(-1)}>
        <Minus size={20} />
      </button>
    </div>
  )

}
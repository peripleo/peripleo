import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useLoadedMap } from '../../hooks';

import './ZoomControl.css';

type ExcludedProps = 'onClick';

interface ZoomControlProps {

  zoomIn?: ReactNode;

  zoomInProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, ExcludedProps>;

  zoomOut?: ReactNode;

  zoomOutProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, ExcludedProps>;

}

export const ZoomControl = (props: ZoomControlProps) => {

  const map = useLoadedMap();

  const onZoom = (inc: number) => () =>
    map.easeTo({ zoom:  map.getZoom() + inc });
  
  return (
    <div className="p6o-zoom-control">
      <button 
        {...props.zoomInProps || {}}
        className={props.zoomInProps?.className ? `p6o-zoom-in ${props.zoomInProps.className}` : 'p6o-zoom-in'}
        aria-label="Zoom in"
        onClick={onZoom(1)}>
        {props.zoomIn || <span>+</span>}
      </button>

      <button 
        {...props.zoomOutProps || {}}
        className={props.zoomOutProps?.className ? `p6o-zoom-out ${props.zoomOutProps.className}` : 'p6o-zoom-out'}
        aria-label="Zoom out"
        onClick={onZoom(-1)}>
        {props.zoomOut || <span>-</span>}
      </button>
    </div>
  )

}
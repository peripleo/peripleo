import React from 'react';
import { useMap } from '../../Peripleo';

export const ZoomControl = props => {

  const map = useMap();

  const onZoom = inc => () =>
    map.easeTo({ zoom:  map.getZoom() + inc });
  
  return (
    <div>
      <button onClick={onZoom(1)}>+</button>
      <button onClick={onZoom(-1)}>-</button>
    </div>
  )

}
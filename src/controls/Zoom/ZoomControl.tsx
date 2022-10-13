import React from 'react';
import { useRecoilState } from 'recoil';
import { mapViewState } from '../../map';
// import { useMap } from '../../map';

export const ZoomControl = () => {

  // const map = useMap();

  const [ viewState, setViewState ] = useRecoilState(mapViewState);

  const onZoom = (inc: number) => () => {
    setViewState({
      ...viewState, 
      zoom: viewState.zoom + inc,
      transitionDuration: 200
    });
    
    // map?.easeTo({ zoom:  map.getZoom() + inc });
  }
  
  return (
    <div>
      <button onClick={onZoom(1)}>+</button>
      <button onClick={onZoom(-1)}>-</button>
    </div>
  )

}
import React from 'react';
import { useRecoilState } from 'recoil';
import { mapViewState } from '../../state';

export const ZoomControl = props => {

  const [viewState, setViewState] = useRecoilState(mapViewState);

  const onZoom = inc => () =>
    setViewState({
      ...viewState, 
      zoom: viewState.zoom + inc
    });
  
  return (
    <div>
      <button onClick={onZoom(1)}>+</button>
      <button onClick={onZoom(-1)}>-</button>
    </div>
  )

}
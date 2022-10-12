import React, { useEffect, useMemo, useRef } from 'react';
import ReactMapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react/typed';
import { WebMercatorViewport } from '@deck.gl/core/typed';
import { useRecoilState } from 'recoil';
import { mapViewState } from '../../../state';
import { ViewState} from '../../../types';

import 'maplibre-gl/dist/maplibre-gl.css';

type MapLibreDeckGLProps = {

  children: React.ReactElement

  mapStyle: string,

  defaultBounds: [[number, number], [number, number]]

  tooltip: Function

  popup: Function

}

const isValidViewState = (viewState: ViewState) => {
  const { longitude, latitude, zoom } = viewState;
  return longitude && latitude && zoom;
}

const getDefaultViewState = (initialBounds: [[number, number], [number, number]], el: HTMLDivElement) => {
  const { offsetWidth, offsetHeight } = el;

  const viewport = new WebMercatorViewport({
    width: offsetWidth,
    height: offsetHeight
  });

  return viewport.fitBounds(initialBounds, {});
}

export const MapLibreDeckGL = (props: MapLibreDeckGLProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const [ viewState, setViewState ] = useRecoilState(mapViewState);

  useEffect(() => {
    // ViewState might be pre-initialized from URL. Use default otherwise
    if (!isValidViewState(viewState) && ref.current) {
      const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
      setViewState(defaultState);
    }
  }, [ ref.current, viewState ]);

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      {isValidViewState(viewState) &&
         <DeckGL
         viewState={viewState}
         onViewStateChange={evt => setViewState(evt.viewState as ViewState)}
         controller={{ scrollZoom: { speed: 0.25, smooth: true }}}>

         <ReactMapGL
           mapStyle={props.mapStyle}>

         </ReactMapGL>
       </DeckGL>
      }

    </div>
  )

}
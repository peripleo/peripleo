import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
// @ts-ignore
import DeckGL from '@deck.gl/react';
import { useDebounce } from 'use-debounce';
import { WebMercatorViewport } from '@deck.gl/core/typed';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useSearch, useGraph } from '../../../../store';
import { mapViewState } from '../../../state';
import { DeckGLLayer, ViewState} from '../../../types';
import { DeckGLMap } from './DeckGLMap';

type DeckGLContainerProps = {

  mapStyle: string,

  defaultBounds: [[number, number], [number, number]]

  layers?: DeckGLLayer[]

  tooltip: Function

  popup: Function

}

const getDefaultViewState = (initialBounds: [[number, number], [number, number]], el: HTMLDivElement) => {
  const { offsetWidth, offsetHeight } = el;

  const viewport = new WebMercatorViewport({
    width: offsetWidth,
    height: offsetHeight
  });

  return viewport.fitBounds(initialBounds, {});
}

const isValidViewState = (viewState: ViewState) => {
  const { longitude, latitude, zoom } = viewState;
  return longitude && latitude && zoom;
}

export const DeckGLContainer = (props: DeckGLContainerProps) => {
  
  const ref = useRef<HTMLDivElement>(null);

  // initialViewState passed into DeckGl
  const [ initialViewState, setInitialViewState ] = useState<ViewState>();

  // DeckGL's current viewState
  const [ currentViewState, setCurrentViewState ] = useState<ViewState>();

  // DeckGL's current viewState, debounced
  const [ debouncedViewState ] = useDebounce(currentViewState, 200);

  // Application-wide Recoil viewState 
  const [ globalViewState, setGlobalState ] = useRecoilState(mapViewState);

  // Sync debounced state upwards, to global app state
  useEffect(() => {
    if (debouncedViewState)
      setGlobalState(debouncedViewState)
  }, [ debouncedViewState ]);
  
  // Set initial view state on first render
  useEffect(() => {
    console.log('first render', globalViewState);

    if (ref.current && !initialViewState) {
      const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
      setInitialViewState(defaultState);
    }
  }, [ ref.current ]);

  // When global viewState changes from the outside (e.g.
  // because the Zoom component modifies it), update
  // the initialViewState, so that DeckGL syncs the map.
  useEffect(() => {
    if (ref.current) {
      if (initialViewState && isValidViewState(globalViewState)) {
        setInitialViewState(globalViewState);
      }
    }
  }, [ globalViewState ]);

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      {initialViewState && 
        <DeckGLMap 
          {...props}
          initialViewState={initialViewState} 
          onViewStateChange={(e: { viewState: ViewState }) =>
            setCurrentViewState(e.viewState)} /> 
      }
    </div>
  )

}
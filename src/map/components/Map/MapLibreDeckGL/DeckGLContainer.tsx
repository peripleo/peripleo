import React, { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useRecoilState } from 'recoil';
import { mapViewState } from '../../../state';
import { DeckGLLayer, ViewState} from '../../../types';
import { DeckGLMap } from './DeckGLMap';
import { getDefaultViewState, isValidViewState } from '../initialState';

type DeckGLContainerProps = {

  mapStyle: string,

  defaultBounds: [[number, number], [number, number]]

  layers?: DeckGLLayer[]

  tooltip: Function

  popup: Function

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
    if (ref.current && !initialViewState) {
      const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
      setInitialViewState(defaultState);
    }
  }, [ ref.current ]);

  useEffect(() => {
    if (ref.current && debouncedViewState) {
      setInitialViewState(getDefaultViewState(props.defaultBounds, ref.current));
    }
  }, [ props.layers ]);

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
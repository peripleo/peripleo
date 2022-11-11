import React, { useEffect, useRef, useState } from 'react';
import { WebMercatorViewport } from '@deck.gl/core/typed';
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

  onClick: Function

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

  useEffect(() => {
    if (ref.current && debouncedViewState) {
      const { current } = ref;

      // Workaround: forces a refresh on the base map if the container element resizes.
      // Without this workaround, only the DeckGL layers update, while the basemap
      // remains "stuck" underneath.
      // See this discussion: https://github.com/performant-software/itsb/pull/29
      const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
        const currentVP = new WebMercatorViewport(debouncedViewState);

        const nw = currentVP.unproject([0, 0]) as [number, number];
        const se = currentVP.unproject([currentVP.width, currentVP.height]) as [number, number];
        
        // Current container DOM element size after the resize
        const { offsetWidth, offsetHeight } = current;

        // Compute a new viewport, using actual container element size
        const updatedVP = new WebMercatorViewport({
          width: offsetWidth,
          height: offsetHeight
        });
      
        const updatedViewState = updatedVP.fitBounds([nw, se], {});
        setInitialViewState(updatedViewState);
      });

      resizeObserver.observe(current);

      return () => resizeObserver.disconnect();
    }
  }, [ debouncedViewState ]);

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
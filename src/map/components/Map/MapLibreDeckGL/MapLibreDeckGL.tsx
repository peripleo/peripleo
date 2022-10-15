import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
// @ts-ignore
import DeckGL from '@deck.gl/react';
import { WebMercatorViewport } from '@deck.gl/core/typed';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useSearch, useGraph } from '../../../../store';
import { mapViewState } from '../../../state';
import { DeckGLLayer, ViewState} from '../../../types';

import { useDebounce } from 'use-debounce';

import { Impl } from './Impl';

import 'maplibre-gl/dist/maplibre-gl.css';

type MapLibreDeckGLProps = {

  children: React.ReactElement

  mapStyle: string,

  defaultBounds: [[number, number], [number, number]]

  layers?: DeckGLLayer[]

  tooltip: Function

  popup: Function

}

const getDefaultViewState = (initialBounds: [[number, number], [number, number]], el: HTMLDivElement) => {
  const { offsetWidth, offsetHeight } = el;

  console.log(offsetHeight, offsetWidth);



  const viewport = new WebMercatorViewport({
    width: offsetWidth,
    height: offsetHeight
  });

  return viewport.fitBounds(initialBounds, {});
}

export const MapLibreDeckGL = (props: MapLibreDeckGLProps) => {
  
  const ref = useRef<HTMLDivElement>(null);

  const { search } = useSearch();

  const graph = useGraph();

  // Local initialViewState
  const [ initialViewState, setInitialViewState ] = useState<ViewState>();

  const [ vs, setVs ] = useState();
  const [ db ] = useDebounce(vs, 250);

  const [ globalViewState, setGlobalState ] = useRecoilState(mapViewState);

  /*
  useEffect(() => {
    // ViewState might be pre-initialized from URL. Use default otherwise
    if (!initialViewState && ref.current) {
      const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
      console.log('def')
      setInitialViewState(defaultState);
    }
  }, [ globalViewState, ref.current ]);
  */

  useEffect(() => {
    setGlobalState(db);
  }, [ db ]);

  useEffect(() => {
    if (ref.current && !initialViewState) {
        console.log('initial');
        const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
        console.log(defaultState);
        setInitialViewState(defaultState);
    }
  }, [ ref.current ]);

  useEffect(() => {
    if (ref.current) {
      if (initialViewState && globalViewState.longitude && globalViewState.latitude) {
        console.log('global!', globalViewState);
        setInitialViewState(globalViewState);
      }
    }
  }, [ globalViewState ]);
     /*
  useEffect(() => {

    if (!globalViewState.transitionDuration) {
      console.log('asfsa');
      setLocalViewState(globalViewState);
    }

  }, [ globalViewState ]);    */

  const onViewStateChange = e => {
    console.log(e);
    setVs(e.viewState);
  }

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      {initialViewState && 
        <Impl 
          initialViewState={initialViewState} onViewStateChange={onViewStateChange} {...props} /> }
    </div>
  )

}
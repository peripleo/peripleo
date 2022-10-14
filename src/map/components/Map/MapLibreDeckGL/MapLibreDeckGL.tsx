import React, { useEffect, useRef } from 'react';
import ReactMapGL from 'react-map-gl';
// @ts-ignore
import DeckGL from '@deck.gl/react'; // Note: /typed version is buggy!
import { WebMercatorViewport } from '@deck.gl/core/typed';
import { useRecoilState } from 'recoil';
import { useSearch, useGraph } from '../../../../store';
import { mapViewState } from '../../../state';
import { DeckGLLayer, ViewState} from '../../../types';

import 'maplibre-gl/dist/maplibre-gl.css';

type MapLibreDeckGLProps = {

  children: React.ReactElement

  mapStyle: string,

  defaultBounds: [[number, number], [number, number]]

  layers?: DeckGLLayer[]

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

  const { search } = useSearch();

  const graph = useGraph();

  const [ viewState, setViewState ] = useRecoilState(mapViewState);

  useEffect(() => {
    // ViewState might be pre-initialized from URL. Use default otherwise
    if (!isValidViewState(viewState) && ref.current) {
      const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
      setViewState(defaultState);
    }
  }, [ ref.current, viewState ]);

  const data = search?.result && search.status === 'OK' && search.result.items.length > 0 ?
    search.result.items : null;

  const layers = props.layers && data ? props.layers.reduce((all, next) => {
    const l = next(data, graph);
    return Array.isArray(l) ?
      [...all, ...l] : [...all, l];
  }, [] as Object[]) : [];

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      {isValidViewState(viewState) &&
        <DeckGL
          viewState={viewState}
          onViewStateChange={(e: { viewState: ViewState }) => {
            setViewState({ ...e.viewState, zoom: Math.max(e.viewState.zoom, 1.6)} );
          }}
          controller={{ scrollZoom: { speed: 0.25, smooth: true }}}
          layers={layers}>

          <ReactMapGL
            mapStyle={props.mapStyle} />
        </DeckGL>
      }
    </div>
  )

}
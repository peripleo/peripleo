import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
// @ts-ignore
import DeckGL from '@deck.gl/react';
import { WebMercatorViewport } from '@deck.gl/core/typed';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useSearch, useGraph } from '../../../../store';
import { mapViewState } from '../../../state';
import { DeckGLLayer, ViewState} from '../../../types';

import 'maplibre-gl/dist/maplibre-gl.css';

type ImplProps = {

  mapStyle: string,

  initialViewState: ViewState

  onViewStateChange: Function

  layers?: DeckGLLayer[]

  tooltip: Function

  popup: Function

}

export const Impl = (props: ImplProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const { search } = useSearch();

  const graph = useGraph();

  const data = search?.result && search.status === 'OK' && search.result.items.length > 0 ?
    search.result.items : null;

  const layers = props.layers && data ? props.layers.reduce((all, next) => {
    const l = next(data, graph);
    return Array.isArray(l) ?
      [...all, ...l] : [...all, l];
  }, [] as Object[]) : [];

  return (
        <DeckGL
          initialViewState={props.initialViewState}
          controller={true} 
          onViewStateChange={props.onViewStateChange}
          layers={layers}>

          <ReactMapGL
            mapStyle={props.mapStyle} />
        </DeckGL>
    
  )

}
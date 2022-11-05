import React, { useMemo } from 'react';
import ReactMapGL from 'react-map-gl';
// @ts-ignore
import DeckGL from '@deck.gl/react';
import { useSearch, useGraph } from '../../../../store';
import { DeckGLLayer, ViewState} from '../../../types';

import '../Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';

type DeckGLMapProps = {

  mapStyle: string,

  initialViewState: ViewState

  onViewStateChange: Function

  layers?: DeckGLLayer[]

  tooltip: Function

  popup: Function

}

export const DeckGLMap = (props: DeckGLMapProps) => {

  const { search } = useSearch();

  const graph = useGraph();

  const data = useMemo(() => search?.result && search.status === 'OK' && search.result.items.length > 0 ?
    search.result.items : null, [ search ]);

  const layers = useMemo(() => props.layers && data ? props.layers.reduce((all, next) => {
    const l = next(data, graph);
    return Array.isArray(l) ?
      [...all, ...l] : [...all, l];
  }, [] as Object[]) : [], [ data, props.layers ]);

  return (
    <DeckGL
      initialViewState={props.initialViewState}
      controller={true} 
      onViewStateChange={props.onViewStateChange}
      layers={layers}
      getTooltip={(feature: any) => props.tooltip({...feature, graph, search})}>

      <ReactMapGL
        mapStyle={props.mapStyle} />
    </DeckGL>    
  )

}
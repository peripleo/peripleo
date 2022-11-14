import React, { useCallback, useMemo, useRef } from 'react';
import ReactMapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react/typed';
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

  onClick: Function

}

export const DeckGLMap = (props: DeckGLMapProps) => {

  const deckRef = useRef(null);

  const { search } = useSearch();

  const graph = useGraph();

  const data = useMemo(() => search?.result && search.status === 'OK' && search.result.items.length > 0 ?
    search.result.items : null, [ search ]);

  const layers = useMemo(() => props.layers && data ? props.layers.reduce((all, next) => {
    const l = next(data, graph);
    return Array.isArray(l) ?
      [...all, ...l] : [...all, l];
  }, [] as Object[]) : [], [ data, props.layers ]);

  const onClick = useCallback((event: React.MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;

    const pickInfo = deckRef.current.pickObject({
      x: offsetX,
      y: offsetY,
      radius: 3
    });

    if (pickInfo && props.onClick)
      props.onClick(pickInfo);
  }, [ props.onClick, deckRef ]);

  return (
    <div onClick={onClick}>
      <DeckGL
        ref={deckRef}
        initialViewState={props.initialViewState}
        controller={true} 
        // @ts-ignore
        onViewStateChange={props.onViewStateChange}
        layers={layers}
        getTooltip={(feature: any) => props.tooltip({...feature, graph, search})}>

        <ReactMapGL
          mapStyle={props.mapStyle} />
      </DeckGL>    
    </div>
  )

}
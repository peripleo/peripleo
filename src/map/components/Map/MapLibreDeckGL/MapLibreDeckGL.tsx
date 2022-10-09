import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactMapGL, { MapLayerMouseEvent, MapRef } from 'react-map-gl';
import DeckGL from '@deck.gl/react/typed';
import { useRecoilState } from 'recoil';
import { mapViewState, selectedState } from '../../../state';
import { MapHover, ViewState} from '../../../types';
import { useGraph, useSearch } from '../../../../store';
import { PopupContainer, TooltipContainer } from '../..';

import 'maplibre-gl/dist/maplibre-gl.css';

type MapLibreDeckGLProps = {

  children: React.ReactElement

  mapStyle: string,

  defaultBounds: [[number, number], [number, number]]

  tooltip: Function

  popup: Function

}

export const MapLibreDeckGL = (props: MapLibreDeckGLProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const mapRef = useRef<MapRef>(null);

  const [ viewState, setViewState ] = useRecoilState(mapViewState);

  const [ selected, setSelected ] = useRecoilState(selectedState);

  const { search } = useSearch();

  const graph = useGraph();

  const [ hover, setHover ] = useState<MapHover | null>();

  const data = useMemo(() => search?.status === 'OK' && search.result?.items.length ? {
    type: 'FeatureCollection',
    features: search.result.items.map(f => ({ ...f, properties: { id: f.id, ...f.properties }}))
  } : null, [ search ]);

  const layerIds = useMemo(() => React.Children.map(props.children, c => c.props.id) || [], [ props.children ]);

  const onMouseMove = useCallback((evt: MapLayerMouseEvent) => {
    if (!mapRef.current)
      return;

    const { point } = evt;

    const features = mapRef.current
      .queryRenderedFeatures(evt.point)
      .filter(l => layerIds.find(id => l.layer.id.startsWith(id)));

    if (features.length > 0) {
      const id = features[0]?.properties?.id;

      const updated: MapHover = hover && (id === hover?.node.id) ? {
        ...hover, ...point // just update mouse position
      } : {
        node: graph.getNodeById(id),
        feature: features[0],
        ...point
      };

      ref.current?.classList.add('hover');
      setHover(updated);
    } else {
      ref.current?.classList.remove('hover');
      setHover(undefined);
    }
  }, [ props.children, search, hover ]);

  const onClick = () => {
    if (hover) {
      const clone = JSON.parse(JSON.stringify(hover));
      setHover(null);
      setSelected(clone);
    } else {
      setSelected(null);
    }
  }

  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      <DeckGL
        viewState={viewState}
        controller={{ scrollZoom: { speed: 0.25, smooth: true }}}
        onViewStateChange={evt => setViewState(evt.viewState as ViewState)}>

        <ReactMapGL
          ref={mapRef}
          mapStyle={props.mapStyle}
          onClick={onClick}
          onMouseMove={onMouseMove}>

          {React.Children.map(props.children, c => React.cloneElement(c, { data }))}

        </ReactMapGL>
      </DeckGL>

      {props.tooltip && hover && 
        <TooltipContainer 
          {...hover} 
          tooltip={props.tooltip} />}

      {props.popup && mapRef.current && selected && 
        <PopupContainer 
          selected={selected} 
          viewState={viewState} 
          map={mapRef.current} 
          popup={props.popup} /> }
    </div>
  )

}
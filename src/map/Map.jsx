import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { useRecoilState } from 'recoil';
import TooltipContainer from './TooltipContainer';
import {useSearch} from '../search';
import {useStore} from '../store';
import { mapViewState } from '../state';

import 'maplibre-gl/dist/maplibre-gl.css';

import './Map.css';

export const MapLibreGL = props => {

  const ref = useRef();

  const mapRef = useRef();

  const [viewState, setViewState] = useRecoilState(mapViewState);
  
  const {search} = useSearch();

  const store = useStore();

  const [hover, setHover] = useState(null);

  const layerIds = useMemo(() => new Set(React.Children.map(props.children, c => c.props.id)));

  /*
  const initialViewState = props.defaultBounds ? {
    bounds: props.defaultBounds
  } : null;
  */

  const data = useMemo(() => search?.status === 'OK' && search.result.items.length > 0 ? {
    type: 'FeatureCollection',
    features: search.result.items.map(f => ({ ...f, properties: { id: f.id, ...f.properties }}))
  } : null, [search]);

  const onMouseMove = useCallback(evt => {
    const { point } = evt;

    const features = mapRef.current
      .queryRenderedFeatures(evt.point)
      .filter(l => layerIds.has(l.layer.id));

    if (features.length > 0) {
      const { id } = features[0].properties;

      const updated = id === hover?.id ? {
        // Same feature, just update mouse position
        ...hover, ...point
      } : {
        // Change feature
        node: store.getNode(id),
        feature: features[0],
        ...point
      };
  
      ref.current.classList.add('hover');
      
      setHover(updated);

      props.onMouseOver && props.onMouseOver(node, evt.originalEvent);
    } else {
      ref.current.classList.remove('hover');

      setHover(null);

      props.onMouseOut && props.onMouseOut();
    }
  }, [props.children]);
  
  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      <ReactMapGL
        ref={mapRef}
        {...viewState}
        mapStyle={props.mapStyle}
        onMouseMove={onMouseMove}
        onMove={evt => setViewState(evt.viewState)}>

        {React.Children.map(props.children, c => React.cloneElement(c, { data }))}
      </ReactMapGL>

      {props.tooltip && hover && 
        <TooltipContainer {...hover} tooltip={props.tooltip} />}
    </div>
  )

}
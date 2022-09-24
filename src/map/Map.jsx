import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { useSearch } from '../search';
import { useStore } from '../store';

import './Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';

export const MapLibreGL = props => {

  const ref = useRef();

  const mapRef = useRef();
  
  const {search} = useSearch();

  const store = useStore();

  const [hover, setHover] = useState(null);

  const layerIds = useMemo(() => new Set(React.Children.map(props.children, c => c.props.id)));

  const initialViewState = props.defaultBounds ? {
    bounds: props.defaultBounds
  } : null;

  const data = useMemo(() => search?.status === 'OK' && search.result.items.length > 0 ? {
    type: 'FeatureCollection',
    features: search.result.items.map(f => ({ ...f, properties: { id: f.id, ...f.properties }}))
  } : null, [search]);

  const onMouseMove = useCallback(evt => {
    const features = mapRef.current
      .queryRenderedFeatures(evt.point)
      .filter(l => layerIds.has(l.layer.id));

    if (features.length === 0) {
      setHover(null);

      ref.current.classList.remove('hover');
      
      props.onMouseOut && props.onMouseOut();
    
    } else if (features[0].properties.id !== hover?.id) {
      const node = store.getNode(features[0].properties.id);
    
      setHover(node);
    
      ref.current.classList.add('hover');
      
      props.onMouseOver && props.onMouseOver(node, evt.originalEvent);
    }
  }, [props.children]);
  
  return (
    <div 
      ref={ref}
      className='p6o-map-container'>

      <ReactMapGL
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle={props.mapStyle}
        onMouseMove={onMouseMove}>

        {React.Children.map(props.children, c => React.cloneElement(c, { data }))}

      </ReactMapGL>
    </div>
  )

}
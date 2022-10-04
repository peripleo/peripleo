import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { useRecoilState } from 'recoil';
import TooltipContainer from './TooltipContainer';
import PopupContainer from './PopupContainer';
import {useSearch} from '../search';
import {useStore} from '../store';
import { mapViewState, selectedState } from '../state';

import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';

export const MapLibreGL = props => {

  const ref = useRef();

  const mapRef = useRef();

  const [viewState, setViewState] = useRecoilState(mapViewState);

  const [selected, setSelected] = useRecoilState(selectedState);
  
  const {search} = useSearch();

  const store = useStore();

  const [hover, setHover] = useState(null);

  const layerIds = useMemo(() => React.Children.map(props.children, c => c.props.id));

  const data = useMemo(() => search?.status === 'OK' && search.result.items.length > 0 ? {
    type: 'FeatureCollection',
    features: search.result.items.map(f => ({ ...f, properties: { id: f.id, ...f.properties }}))
  } : null, [search]);

  const onMouseMove = useCallback(evt => {
    if (!mapRef.current)
      return;

    const { point } = evt;

    const features = mapRef.current
      .queryRenderedFeatures(evt.point)
      .filter(l => layerIds.find(id => l.layer.id.startsWith(id)));

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
    } else {
      ref.current.classList.remove('hover');
      setHover(null);
    }
  }, [props.children]);

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

      <ReactMapGL
        ref={mapRef}
        {...viewState}
        mapStyle={props.mapStyle}
        onClick={onClick}
        onMouseMove={onMouseMove}
        onMove={evt => setViewState(evt.viewState)}>

        {React.Children.map(props.children, c => React.cloneElement(c, { data }))}

      </ReactMapGL>

      {props.tooltip && hover && 
        <TooltipContainer 
          {...hover} 
          tooltip={props.tooltip} />}

      {props.popup && selected && 
        <PopupContainer 
          selected={selected} 
          viewState={viewState} 
          map={mapRef.current} 
          popup={props.popup} /> }
    </div>
  )

}
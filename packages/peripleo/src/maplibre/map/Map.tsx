import { useEffect, useRef, useState } from 'react';
import { Map as MapLibre, MapMouseEvent, PointLike } from 'maplibre-gl';
import { MapContext } from './MapContext';
import { MapProps } from './MapProps';
import { PopupContainer } from '../components/Popup';
import { useSelectionState, useHoverState } from '../../state';
import { Feature } from '../../Types';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 10;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<MapLibre>(null);

  const { selected, setSelected } = useSelectionState();

  // Hover state according to mouse move events
  const [mapHover, setMapHover] = useState<{ source: string, feature: Feature } | undefined>();

  // Global Peripleo state, to sync with mouse move state
  const { hover, setHover } = useHoverState();

  const getFeature = (evt: MapMouseEvent, withBuffer?: boolean) => {
    const map = evt.target;

    const query = withBuffer ? [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ] as [PointLike, PointLike]: evt.point;

    const features = map.queryRenderedFeatures(query)
      .filter(feature => 'interactive' in (feature.layer.metadata as object || {}));

    if (features.length > 0) {
      const { source, id, type, properties, geometry } = features[0];

      const feature = { id, type, properties, geometry } as Feature;

      return { source, feature };
    } else {
      return { source: undefined, feature: undefined };
    }
  }

  const onClick = (evt: MapMouseEvent) => {
    const { feature } = getFeature(evt, true);
    setSelected(feature);
  }

  const onMouseMove = (evt: MapMouseEvent) => {
    const map = evt.target;

    const { source, feature } = getFeature(evt);

    const setFeatureState = (source: string, feature: Feature, hover: boolean) =>
      map.setFeatureState({ source, id: feature.id }, { hover });

    setMapHover(hover => {
      if (feature?.id === hover?.feature.id) {
        return hover; // No change
      } else {
        if (hover)
          setFeatureState(hover.source, hover.feature, false);
        
        if (feature)
          setFeatureState(source, feature, true);

        return feature ? { source, feature } : undefined;
      }
    });
  }

  // Sync map hover state 'upwards'
  useEffect(() => setHover(mapHover?.feature), [mapHover]);

  useEffect(() => {
    const map = new MapLibre({
      container: ref.current,
      style: props.style || document.querySelector('meta[name="peripleo.map.style"]')?.getAttribute('content'),
      bounds: props.defaultBounds
    });

    if (props.disableScrollZoom)
      map.scrollZoom.disable();

    map.on('click', onClick);
    map.on('mousemove', onMouseMove);

    setMap(map);

    return () => {
      map.off('click', onClick);
      map.off('mousemove', onMouseMove);
    }
  }, []);

  return (
    <div 
      ref={ref}
      className={props.className ? `${props.className} p6o-map-container`: 'p6o-map-container'}>

      <MapContext.Provider value={map}>
        {map && (
          <>
            {props.children}

            {props.popup && (
              <PopupContainer 
                map={map}
                selected={selected}
                popup={props.popup} 
                onClose={() => setSelected(undefined)} />
            )}
          </>
        )}
      </MapContext.Provider>
    </div>
  )

}
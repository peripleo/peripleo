import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Map as MapLibre, MapMouseEvent, PointLike } from 'maplibre-gl';
import { MapContext } from './MapContext';
import { MapProps } from './MapProps';
import { PopupContainer } from '../components/Popup';
import { useSelectionState, useHoverState } from '../../state';
import { useFeatureRadioState } from './useFeatureState';
import { Feature } from '../../Types';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 10;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<MapLibre>(null);

  // Hover state according to mouse move events
  const [mapHover, setMapHover] = useFeatureRadioState('hover');

  // Global Peripleo state (which can be changed programmatically from outside)
  const {hover, setHover} = useHoverState();

  // Map selection state
  const [mapSelection, setMapSelection] = useFeatureRadioState('selected');

  // Global Peripleo state (which can be changed programmatically from outside)
  const {selected, setSelected} = useSelectionState();

  const isExternalChange = useRef<boolean>(true);

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

  const onMouseMove = (evt: MapMouseEvent) => {
    const { feature, source } = getFeature(evt);

    isExternalChange.current = false;
    setMapHover(evt.target, feature, source);
  }

  const onClick = (evt: MapMouseEvent) => {
    const { feature, source } = getFeature(evt, true);

    isExternalChange.current = false;
    setMapSelection(evt.target, feature, source);
  }

  useLayoutEffect(() => {
    if (!isExternalChange.current)
      setHover(mapHover?.feature); // sync hover state upwards
  }, [mapHover]);

  useLayoutEffect(() => {
    if (isExternalChange.current)
      setMapHover(map, hover); // sync external update downwards

    isExternalChange.current = true;
  }, [map, hover]);

  useLayoutEffect(() => {
    if (!isExternalChange.current)
      setSelected(mapSelection?.feature); // sync selection state upwards
  }, [mapSelection]);

  useLayoutEffect(() => {
    if (isExternalChange.current)
      setMapSelection(map, selected); // sync external update downwards

    isExternalChange.current = true;
  }, [map, selected]);

  useEffect(() => {
    const map = new MapLibre({
      container: ref.current,
      style: props.style || document.querySelector('meta[name="peripleo.map.style"]')?.getAttribute('content'),
      bounds: props.defaultBounds,
      hash: 'map'
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
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

  const { hover, setHover } = useHoverState();

  const getFeature = (evt: MapMouseEvent, withBuffer?: boolean): Feature | undefined => {
    const map = evt.target;

    const query = withBuffer ? [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ] as [PointLike, PointLike]: evt.point;

    const features = map.queryRenderedFeatures(query)
      .filter(feature => 'interactive' in (feature.layer.metadata as object || {}));

    if (features.length > 0) {
      const { type, properties, geometry } = features[0];
      return { type, properties, geometry } as Feature;
    }
  }

  const onClick = (evt: MapMouseEvent) => {
    const feature = getFeature(evt, true);
    setSelected(feature);
  }

  const onMouseMove = (evt: MapMouseEvent) => {
    const feature = getFeature(evt);
    setHover(hover => 
      feature?.properties.id === hover?.properties.id ? hover : feature);
  }

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
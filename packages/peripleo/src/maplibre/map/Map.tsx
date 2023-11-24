import { useEffect, useRef, useState } from 'react';
import { Map as MapLibre, MapMouseEvent, PointLike } from 'maplibre-gl';
import { MapContext } from './MapContext';
import { MapProps } from './MapProps';
import { PopupContainer } from '../components/Popup';
import { useSelectionState } from '../../state';
import { Feature } from '../../Types';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 10;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<MapLibre>(null);

  const { selected, setSelected } = useSelectionState();

  const onMapClicked = (evt: MapMouseEvent) => {
    const map = evt.target;

    const bbox: [PointLike, PointLike] = [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ];

    const features = map.queryRenderedFeatures(bbox)
      .filter(feature => 'interactive' in (feature.layer.metadata as object || {}));

    if (features.length > 0) {
      const { type, properties, geometry } = features[0];
      setSelected({ type, properties, geometry } as Feature);
    } else {
      setSelected(undefined);
    }
  }

  useEffect(() => {
    const map = new MapLibre({
      container: ref.current,
      style: props.style || document.querySelector('meta[name="peripleo.map.style"]')?.getAttribute('content'),
      bounds: props.defaultBounds
    });

    if (props.disableScrollZoom)
      map.scrollZoom.disable();

    map.on('click', onMapClicked);

    setMap(map);
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
                onClose={() => setSelected(null)} />
            )}
          </>
        )}
      </MapContext.Provider>
    </div>
  )

}
import { useEffect, useRef, useState } from 'react';
import { Map as MapLibre, MapMouseEvent, PointLike, /* LngLatBoundsLike */ } from 'maplibre-gl';
import { MapContext } from './MapContext';
import { MapProps } from './MapProps';
import { PopupContainer } from '../components/Popup';
import { /* SearchStatus, useSearch, */ useSelectionState, useStore } from '../../state';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 10;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  // const { search } = useSearch();
  
  // const store = useStore();

  const [map, setMap] = useState<MapLibre>(null);

  // const [loaded, setLoaded] = useState(false);

  const [selected, setSelected] = useSelectionState();

  const onMapClicked = (evt: MapMouseEvent) => {
    const map = evt.target;

    const bbox: [PointLike, PointLike] = [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ];

    const features = map.queryRenderedFeatures(bbox)
      // @ts-ignore
      .filter(feature => feature.layer.metadata?.interactive);

    if (features.length > 0) {
      // TODO pick feature with smallest area?
      // const place = store.getPlaceById(features[0].properties.id);

      // @ts-ignore
      setSelected(features);
    } else {
      setSelected(null);
    }
  };

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
    // setLoaded(true);
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
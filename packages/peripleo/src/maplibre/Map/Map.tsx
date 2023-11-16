import { useEffect, useRef, useState } from 'react';
import { Map as MapLibre, MapMouseEvent, PointLike, LngLatBoundsLike } from 'maplibre-gl';
import { MapContext } from './MapContext';
import { MapProps } from './MapProps';
import { PopupContainer } from '../Popup';
import { SearchStatus, useSearch, useSelectionState, useStore } from '../../state';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 10;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const { search } = useSearch();
  
  const store = useStore();

  const [map, setMap] = useState<MapLibre>(null);

  const [loaded, setLoaded] = useState(false);

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
      const place = store.getPlaceById(features[0].properties.id);
      setSelected(place);
    } else {
      setSelected(null);
    }
  };

  useEffect(() => {
    if (loaded || search.status !== SearchStatus.OK)
      return;

    console.log('[Peripleo] initializing map');

    const { minLon, minLat, maxLon, maxLat } = search.result.bounds || {};
    
    const bounds: LngLatBoundsLike = props.defaultBounds ? 
      props.defaultBounds : [[ minLon, minLat ], [ maxLon, maxLat ]];
    
    const map = new MapLibre({
      container: ref.current,
      style: props.style,
      bounds 
    });

    if (props.disableScrollZoom)
      map.scrollZoom.disable();

    map.on('click', onMapClicked);

    setMap(map);
    setLoaded(true);
  }, [search, loaded]);

  return (
    <div 
      ref={ref}
      className="p6o-map-container">

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
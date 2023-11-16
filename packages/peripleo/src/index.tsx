import { useEffect, useState } from 'react'; 
import { createRoot } from 'react-dom/client';
import { TEIView } from './peripleo-ext';
import {
  importTEITrace, 
  teiLayerStyle, 
  onSearch, 
  toGeoJSON,
  PlaceTooltip,
  LayerTooltip
} from './pausanias';
import { 
  Peripleo,
  BrowserStore, 
  Controls, 
  DraggablePanel, 
  FeatureCollection,
  SearchHandler 
} from './peripleo';
import {  
  LayerSwitcher,
  Map as MapLibreMap, 
  PulsingSelectionMarker, 
  SearchResultsLayer,
  StaticDataLayer,
  Zoom 
} from './peripleo/maplibre';

import './peripleo/theme/default/index.css';
import './peripleo-ext/theme/default/index.css';

// Data layer colors
const PALETTE = ['#0000ff'];

export const App = () => {

  const MAP_STYLE = document.querySelector('meta[name="map.style"]')?.getAttribute('content');

  const [places, setPlaces] = useState([]);

  const [trace, setTrace] = useState(null);

  const [layers, setLayers] = useState(new Map<string, FeatureCollection>());

  const loaded = places.length > 0 && trace;

  useEffect(() => {
    fetch('pleiades-referenced-places.lp.json')
      .then(res => res.json())
      .then(geojson => setPlaces(geojson.features));

    fetch('ascsa-monuments-places.lp.json')
      .then(res => res.json())
      .then(geojson => setLayers(map =>
        new Map(map).set('ASCSA Monuments', geojson as FeatureCollection)))
  }, []);

  const onTEILoaded = (tei: Element) => {
    const placeNames = Array.from(tei.querySelectorAll('tei-body tei-placename'));
    setTrace(importTEITrace('Pausanias', placeNames));
  }

  return (
    <Peripleo>
      <BrowserStore
        places={loaded ? places : []}
        traces={loaded ? [trace] : []}>

        <SearchHandler onSearch={onSearch} />

        <MapLibreMap 
          style={MAP_STYLE}
          popup={props => (
            <PlaceTooltip {...props} />
          )}>

          <PulsingSelectionMarker 
            duration={1000}
            size={80} 
            rgb={[246, 112, 86]} />

          <SearchResultsLayer 
            id="pleiades-places" 
            style={teiLayerStyle}
            toGeoJSON={toGeoJSON} />

          <Controls position="topright">
            <Zoom />

            <LayerSwitcher
              names={Array.from(layers.keys())}>

              {Array.from(layers.keys()).map((name, idx) => (
                <StaticDataLayer 
                  key={name}
                  id={name}
                  color={PALETTE[idx % PALETTE.length]}
                  data={layers.get(name)} 
                  tooltip={props => <LayerTooltip {...props} />} />
              ))}
            </LayerSwitcher>
          </Controls>
        </MapLibreMap>

        <DraggablePanel
          width={450}>
          <TEIView
            title="Pausanias Book 1"
            src="pausanias-book1.tei.xml" 
            onLoad={onTEILoaded} />
        </DraggablePanel>
      </BrowserStore>
    </Peripleo>
  )

}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
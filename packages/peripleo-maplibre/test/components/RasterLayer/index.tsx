import React, { useState }from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo, Map, RasterLayer } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const OSM = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const App = () => {

  const [url, setURL] = useState<string>(OSM);

  const toggle = () => 
    setURL(current => current === OSM ? ESRI : OSM);

  return (
    <>
      <button 
        className="toggle"
        onClick={toggle}>TOGGLE</button>
      <Map>
        <RasterLayer 
          id="points" 
          url={url} />
      </Map>
    </>
  )

}

window.onload = function() {

  ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
      <Peripleo>
        <App />
      </Peripleo>
    </React.StrictMode>
  )
    
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo } from '@peripleo/peripleo';
import { Map, ZoomControl } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';

const App = () => {

  return (
      <Map
        style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

        <ZoomControl
          zoomIn={<span>Click to Zoom In</span>} 
          zoomOut={<span>Clickt to Zoom Out</span>} />
      </Map>
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
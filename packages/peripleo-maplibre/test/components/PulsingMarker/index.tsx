import React from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo, Map } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const App = () => {

  return (
    <Map
      style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

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
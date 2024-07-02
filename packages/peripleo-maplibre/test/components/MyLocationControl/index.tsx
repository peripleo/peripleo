import React from 'react';
import { Peripleo } from '@peripleo/peripleo';
import ReactDOM from 'react-dom/client';
import { Map, MyLocationControl } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';

const App = () => {

  return (
    <Map
      style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">
      <MyLocationControl />
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
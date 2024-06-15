import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo } from '@peripleo/peripleo';
import { Map, GeoJSONLayer, HoverTooltip } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const App = () => {

  const [data, setData] = useState();

  useEffect(() => {
    fetch('fixture_at_ch.geojson')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
      <Map
        style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

        {data && (
          <GeoJSONLayer 
            interactive
            id="borders" 
            data={data} />
        )}

        <HoverTooltip 
          tooltip={state => (
            <div className="my-tooltip">{state.mapFeature?.properties.NAME_LONG}</div>
          )} />
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
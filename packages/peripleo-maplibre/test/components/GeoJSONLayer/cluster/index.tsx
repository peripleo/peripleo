import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo, Map, GeoJSONLayer } from '../../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const App = () => {

  const [data, setData] = useState();

  useEffect(() => {
    fetch('fixture_points.geojson')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <Map
      style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

      {data && (
        <GeoJSONLayer 
          id="points" 
          data={data} 
          cluster={true} 
          clusterRadius={20} />
      )}
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
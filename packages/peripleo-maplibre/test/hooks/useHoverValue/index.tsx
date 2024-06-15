import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom/client';
import { useHoverValue } from '@peripleo/peripleo';
import { Peripleo, Map, GeoJSONLayer } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const App = () => {

  const [data, setData] = useState();

  const hover = useHoverValue();

  useEffect(() => {
    fetch('fixture_points.geojson')
      .then(res => res.json())
      .then(setData);
  }, []);

  console.log('hover', hover);
  
  return (
    <>
      <Map
        style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

        {data && (
          <GeoJSONLayer 
            interactive
            id="points" 
            data={data} 
            cluster={true} 
            clusterRadius={20} />
        )}
      </Map>

      <div className="console">
        {hover ? 'hover': 'no hover'}
      </div>
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
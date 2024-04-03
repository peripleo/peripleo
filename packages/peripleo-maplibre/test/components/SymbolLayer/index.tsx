import React, { useEffect, useState }from 'react';
import { Peripleo, FeatureCollection, useHoverValue } from '@peripleo/peripleo';
import ReactDOM from 'react-dom/client';
import { Map, SymbolLayer } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const App = () => {

  const [data, setData] = useState<FeatureCollection | undefined>();

  const hover = useHoverValue();

  useEffect(() => {
    fetch('fixture.geojson')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  useEffect(() => console.log('hover:', hover), [hover]);

  return (
    <Map
      style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

      {data && (
        <SymbolLayer 
          id="pleiades-places" 
          interactive={true}
          size={0.25}
          symbol="https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png"
          data={data} />
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
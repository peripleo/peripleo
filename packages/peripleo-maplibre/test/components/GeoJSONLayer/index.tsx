import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo, Map, GeoJSONLayer } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';

const App = () => {

  const [austria, setAustria] = useState();

  const [switzerland, setSwitzerland] = useState();

  const [current, setCurrent] = useState();

  useEffect(() => {
    Promise.all([
      fetch('fixture_at.geojson').then(res => res.json()),
      fetch('fixture_ch.geojson').then(res => res.json())
    ]).then(([austria, switzerland]) => {
      setAustria(austria);
      setSwitzerland(switzerland);

      setCurrent(austria);
    });
  }, []);

  const toggle = () => {
    if (current === austria)
      setCurrent(switzerland)
    else
      setCurrent(austria);
  }

  return (
    <>
      <button 
        className="toggle"
        onClick={toggle}>TOGGLE</button>

      <Map 
        className="flex-grow"
        style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

        {current && (
          <GeoJSONLayer id="borders" data={current} />
        )}
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
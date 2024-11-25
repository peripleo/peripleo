import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom/client';
import { Peripleo, Map, GeoJSONLayer, useSelectionState } from '../../../src';

import '@peripleo/maplibre/peripleo-maplibre.css';
import '@peripleo/peripleo/default-theme';
import { Feature } from '@peripleo/peripleo';

const App = () => {

  const [data, setData] = useState();

  const { selection, setSelection } = useSelectionState();

  useEffect(() => {
    fetch('fixture_points.geojson')
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    console.log('selection changed', selection);
  }, [selection]);

  const onSelect = () => {
    const selected: Feature = {
      id: 3,
      type: 'Feature',
      properties: {
        name: 'Saint-Félix-d\'Otis'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -75.849253579389796,
          48.278693733790902
        ]
      }
    };

    setSelection({ selected });
  }

  return (
    <>
      <Map
        style="https://api.maptiler.com/maps/voyager/style.json?key=RFavxpVJ82EHyrN2kxsF">

        {data && (
          <GeoJSONLayer 
            interactive
            id="my-data" 
            data={data} 
            cluster={true} 
            clusterRadius={20} />
        )}
      </Map>

      <div className="console">
        <button onClick={onSelect}>
          Select
        </button>
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
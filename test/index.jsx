import React from 'react';
import ReactDOM from 'react-dom/client';

import FIXTURES from './sample-records.json';

import Peripleo, { Map } from '../packages/peripleo';

const App = () => {

  const { nodes, edges } = FIXTURES;

  return (
    <Peripleo
      nodes={nodes}
      edges={edges}>

      <Map.MapLibreGL
        mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg" /> 

    </Peripleo>
  )

}

window.onload = function() {

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
    
}
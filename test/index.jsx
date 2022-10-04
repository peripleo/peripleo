import React from 'react';
import ReactDOM from 'react-dom/client';
import Peripleo, { 
  BrowserStoreProvider, 
  Controls, 
  HeatmapLayer,
  Map, 
  ZoomControl } from '../src';

import FIXTURES from './sample-records.json';

const App = () => {

  const { nodes, edges } = FIXTURES;

  return (
    <BrowserStoreProvider 
      nodes={nodes}
      edges={edges}
      index={['properties.title']}>
      
      <Peripleo>      
        <Map.MapLibreGL
          mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg" 
          defaultBounds={[-15.764914, 33.847608, 35.240991, 58.156214]}> 
        
          <HeatmapLayer
            id="kima-layer-places" />

        </Map.MapLibreGL>

        <Controls>
          <ZoomControl />
        </Controls>

      </Peripleo>
    </BrowserStoreProvider>
  )

}

window.onload = function() {

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
    
}
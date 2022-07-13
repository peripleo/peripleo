import React from 'react';
import ReactDOM from 'react-dom/client';

import FIXTURES from './sample-records.json';

import Peripleo, { BrowserStoreProvider, Map } from '../packages/peripleo';

import { HUD, SearchInput } from '../packages/peripleo/hud';

const App = () => {

  const { nodes, edges } = FIXTURES;

  return (
    <BrowserStoreProvider 
      nodes={nodes}
      edges={edges}>
      
      <Peripleo>      
        <Map.MapLibreGL
          mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg" /> 
          
        <HUD>
          <SearchInput placeholder="Search..." />
        </HUD>
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
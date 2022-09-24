import React from 'react';
import ReactDOM from 'react-dom/client';

import FIXTURES from './sample-records.json';

import Peripleo, { BrowserStoreProvider, Map } from '../src';

import { HUD, SearchInput } from '../src/hud';

/** 
 * Converts a search result to mappable features, 
 * with `weight`, `color`, `opacity` and `symbol`
 * properties.
 */
const presenter = search => {

} 

const mergeStrategy = {
  type: 'precision',
  precision: 5,
  weight: 'add',
  color: ''
}

const App = () => {

  const { nodes, edges } = FIXTURES;

  return (
    <BrowserStoreProvider 
      nodes={nodes}
      edges={edges}>
      
      <Peripleo
        presenter={presenter}
        mergeStrategy={mergeStrategy}>      

        <Map.MapLibreGL
          mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg" 
          defaultBounds={[-15.764914, 33.847608, 35.240991, 58.156214]} /> 
          
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
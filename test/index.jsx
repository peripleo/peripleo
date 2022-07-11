import React from 'react';
import ReactDOM from 'react-dom/client';

import { Map } from '../src';

const App = () => {

  return (
    <Map 
      mapStyle="https://api.maptiler.com/maps/outdoor/style.json?key=cqqmcLw28krG9Fl7V3kg" /> 
  )

}

window.onload = function() {

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
    
}
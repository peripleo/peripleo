import React, { useEffect, useState }from 'react';
import ReactDOM from 'react-dom/client';
import Peripleo, { 
  BrowserStore, 
  Controls, 
  Map, 
  PointLayer,
  SearchBox,
  ZoomControl 
} from '../src';

import FIXTURES from './sample-records.json';

const App = () => {

  const [ nodes, setNodes ] = useState([]);
  const [ edges, setEdges ] = useState([]);

  useEffect(() => {
    // Simulate an HTTP load delay
    console.log('Loading data...');
    
    setTimeout(() => {
      setNodes(FIXTURES.nodes);
      setEdges(FIXTURES.edges);
    }, 0);
  }, [])

  return (
    <Peripleo>
      <BrowserStore 
        nodes={nodes}
        edges={edges}
        index={['title']}>

        <Map.MapLibre
          mapStyle="https://api.maptiler.com/maps/voyager/style.json?key=cqqmcLw28krG9Fl7V3kg"
          defaultBounds={[[-15.764914, 33.847608], [35.240991, 58.156214]]}> 

          <PointLayer 
            id="sample-point-layer"
            color="#9d00d1" 
            sizes={[
              1, 4,
              4, 18
            ]} />

        </Map.MapLibre>

        <Controls>
          <SearchBox />
          <ZoomControl />
        </Controls>

      </BrowserStore>
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
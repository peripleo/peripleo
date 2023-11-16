import { 
  Controls, 
  MapLibre, 
  Peripleo, 
  Zoom 
} from '@peripleo/peripleo';

import '@peripleo/theme-default';

export const App = () => {

  return (

      <MapLibre>
        <Controls position="topright">
          <Zoom />
        </Controls>
      </MapLibre>

  )

}
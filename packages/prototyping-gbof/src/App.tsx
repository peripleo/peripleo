import { 
  Controls, 
  MapLibre, 
  Peripleo, 
  Zoom 
} from '@peripleo/peripleo';

import '@peripleo/theme-default';

export const App = () => {

  return (
    <Peripleo>
      <MapLibre>
        <Controls position="topright">
          <Zoom />
        </Controls>
      </MapLibre>
    </Peripleo>
  )

}
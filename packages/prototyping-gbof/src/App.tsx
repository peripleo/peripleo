import { Peripleo, Controls } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  return (
    <Peripleo>
      <Map>
        <Controls position="topright">
          <Zoom />
        </Controls>
      </Map>
    </Peripleo>
  )

}
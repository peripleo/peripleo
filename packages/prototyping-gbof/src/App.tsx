import { Peripleo, Controls, SearchHandler } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { createTypeSenseSearchHandler, SearchInput} from './search';

import '@peripleo/peripleo/default-theme';

const onSearch = createTypeSenseSearchHandler();

export const App = () => {

  return (
    <Peripleo>
      <SearchHandler onSearch={onSearch} />

      <Map>
        <Controls position="topleft">
          <SearchInput />
        </Controls>

        <Controls position="topright">
          <Zoom />
        </Controls>
      </Map>
    </Peripleo>
  )

}
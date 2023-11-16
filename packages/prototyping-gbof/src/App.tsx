import { Peripleo, Controls, SearchHandler } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { createCoreDataSearchHandler, CoreDataSearchProvider, SearchInput} from './search';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  return (
    <Peripleo>
      <CoreDataSearchProvider>
        <SearchHandler 
          onSearch={createCoreDataSearchHandler()} />

        <Map>
          <Controls position="topleft">
            <SearchInput />
          </Controls>

          <Controls position="topright">
            <Zoom />
          </Controls>
        </Map>
      </CoreDataSearchProvider>
    </Peripleo>
  )

}
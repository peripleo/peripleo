import { Peripleo, Controls, SearchHandler } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { SearchInput, SearchResultList } from './components';
import { createCoreDataSearchHandler, CoreDataProvider } from './coredata';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  return (
    <Peripleo>
      <CoreDataProvider>
        <SearchHandler
          onSearch={createCoreDataSearchHandler()} />

        <Map>
          <Controls position="topleft">
            <SearchInput />
            <SearchResultList />
          </Controls>

          <Controls position="topright">
            <Zoom />
          </Controls>
        </Map>
      </CoreDataProvider>
    </Peripleo>
  )

}
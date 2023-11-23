import { HashRouter, Routes, Route } from 'react-router-dom';
import { Controls, Peripleo } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, TypeSenseSearch } from './components';
import { Search, SiteDetails } from './pages';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  return (
    <Peripleo>
      <TypeSenseSearch>
        <div className="w-full h-full flex flex-col">
          <AppHeader className="flex-grow-0 flex-shrink-0" />

          <main className="relative flex flex-grow">
            <HashRouter>
              <Routes>
                <Route path="/">
                  <Route index element={<Search />} />
                  <Route path="site/:site" element={<SiteDetails />} />
                </Route>
              </Routes>
            </HashRouter>

            <Map className="flex-grow">
              <Controls position="topright">
                <Zoom />
              </Controls>
            </Map>
          </main>
        </div>
      </TypeSenseSearch>
    </Peripleo>
  )

}
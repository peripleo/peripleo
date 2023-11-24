import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Controls, Peripleo } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, HackedResultsMapLayer, TypeSenseSearch } from './components';
import { Search, SiteDetails } from './pages';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  return (
    <Peripleo>
      <TypeSenseSearch>
        <HashRouter>
          <div className="w-full h-full flex flex-col font-sans">
            <AppHeader className="flex-grow-0 flex-shrink-0" />

            <main className="relative flex flex-grow">
              <Routes>
                <Route path="/">
                  <Route index element={<Search />} />
                  <Route path="site/:site" element={<SiteDetails />} />
                </Route>
              </Routes>

              <Map className="flex-grow">
                <Controls position="topright">
                  <Zoom />
                </Controls>

                <HackedResultsMapLayer
                  id="searchresults" />
              </Map>
            </main>
          </div>
        </HashRouter>
      </TypeSenseSearch>
    </Peripleo>
  )

}
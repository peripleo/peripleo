import { useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Controls, Peripleo, useSelectionValue } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, HackedResultsMapLayer, TypeSenseSearch } from './components';
import { Search, SiteDetails } from './pages';

import '@peripleo/peripleo/default-theme';

const MapSelectionListener = () => {

  const selected = useSelectionValue();

  const navigate = useNavigate();

  useEffect(() => {
    // If a selection happens via the map, navigate to site details
    if (selected)
      navigate(`/site/${selected.id}`);
  }, [selected]);

  return null;

}

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
                  <Route path="site/:siteId" element={<SiteDetails />} />
                  <Route path="*" element={<Search />} />
                </Route>
              </Routes>

              <MapSelectionListener />

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
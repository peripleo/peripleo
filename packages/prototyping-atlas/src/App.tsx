import { useEffect } from 'react';
import { Controls, Peripleo, useSelectionValue } from '@peripleo/peripleo';
import { Map, Tooltip, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, HackedResultsMapLayer, SearchResultTooltip, TypeSenseSearch } from './components';
import { Router, Routes, Route, useNavigate } from './components/Router';
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
        <Router>
          <div className="w-full h-full flex flex-col font-sans">
            <AppHeader className="flex-grow-0 flex-shrink-0" />

            <main className="relative flex flex-grow">
              <Routes>
                <Route match="/site/:siteId" element={ <SiteDetails /> } />
                <Route element={ <Search /> } />
              </Routes>
                
              <MapSelectionListener />

              <Map className="flex-grow">
                <Controls position="topright">
                  <Zoom />
                </Controls>

                <HackedResultsMapLayer
                  id="searchresults" />

                <Tooltip 
                  layerId="searchresults" 
                  content={(target, event) => (
                    <SearchResultTooltip target={target} event={event} />
                  )}/>
              </Map>
            </main>
          </div>
        </Router>
      </TypeSenseSearch>
    </Peripleo>
  )

}
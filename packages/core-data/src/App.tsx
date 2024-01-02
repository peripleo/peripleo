import { useEffect } from 'react';
import { Map, PulsingSelectionMarker, Tooltip, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, SearchResultsMapLayer, SearchResultTooltip, TypeSenseSearch } from './components';
import {  CoreDataProperties } from './model/lp/CoreDataPlaceFeature';
import { Search, SiteDetails } from './pages';
import { useRuntimeConfig } from './CoreDataConfig';
import { 
  Controls,
  Route,
  Router,
  Routes,
  useNavigate,
  useSelectionValue 
} from '@peripleo/peripleo';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  const { branding } = useRuntimeConfig();

  const selected = useSelectionValue<CoreDataProperties>();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (selected?.id)
      navigate(`/site/${selected.id}`);
  }, [selected?.id]);

  return (
    <div className="w-full h-full flex flex-col font-sans">
      <AppHeader className="flex-grow-0 flex-shrink-0" />

      <main className="relative flex flex-grow">
        <Routes>
          <Route match="/site/" element={ <SiteDetails /> } />
          <Route element={ <Search /> } />
        </Routes>

        <Map 
          className="flex-grow"
          style={branding.map_style}>
          <Controls position="topright">
            <Zoom />
          </Controls>

          <SearchResultsMapLayer
            id="searchresults" 
            visible={!selected} />

          <Tooltip 
            layerId="searchresults" 
            content={(target, event) => (
              <SearchResultTooltip target={target} event={event} />
            )}/>
        </Map>
      </main>
    </div>
  )

}
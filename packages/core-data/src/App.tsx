import { useEffect } from 'react';
import { LayerSwitcher, Map, MixedGeoJSONLayer, Tooltip, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, SearchResultsMapLayer, SearchResultTooltip } from './components';
import {  CoreDataProperties } from './model/lp/CoreDataPlaceFeature';
import { Search, SiteDetails } from './pages';
import { useRuntimeConfig } from './CoreDataConfig';
import { 
  Controls,
  Route,
  Routes,
  useNavigate,
  useSelectionValue 
} from '@peripleo/peripleo';

import { POINT_STYLE, FILL_STYLE, STROKE_STYLE } from './layerStyles';

import '@peripleo/peripleo/default-theme';

export const App = () => {

  const { branding, layers } = useRuntimeConfig();

  const selected = useSelectionValue<CoreDataProperties>();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (selected?.id)
      navigate(`/site/${selected.properties.uuid}`);
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

            {layers?.length > 0 && (            
              <LayerSwitcher names={layers.map(l => l.name)}>
                {layers.map(l => (
                  <MixedGeoJSONLayer 
                    key={l.name} 
                    id={l.name}
                    data={l.url} 
                    fillStyle={FILL_STYLE} 
                    strokeStyle={STROKE_STYLE} 
                    pointStyle={POINT_STYLE} 
                    />
                ))}
              </LayerSwitcher>
            )}
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
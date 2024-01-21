import { useState, useEffect } from 'react';
import { Map, Tooltip, Zoom } from '@peripleo/maplibre';
import { AppHeader, OverlayLayer, SearchResultsMapLayer, SearchResultTooltip } from './components';
import {  CoreDataProperties } from './model/lp/CoreDataPlaceFeature';
import { Search, SiteDetails } from './pages';
import { MapLayerConfig, toLayerStyle, useRuntimeConfig } from './CoreDataConfig';
import { 
  Controls,
  Route,
  Routes,
  useNavigate,
  useSelectionValue 
} from '@peripleo/peripleo';

import '@peripleo/peripleo/default-theme';
import { LayerMenu } from './components/LayerMenu';

export const App = () => {

  const { baselayers } = useRuntimeConfig();

  const [baselayer, setBaselayer] = useState(baselayers[0]);

  const [overlays, setOverlays] = useState<MapLayerConfig[]>([]);

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
          style={toLayerStyle(baselayer, baselayer.name)}>
            
          <Controls position="topright">
            <Zoom />
            {baselayers.length > 1 && (
              <LayerMenu 
                onChangeBaselayer={setBaselayer} 
                onChangeOverlays={setOverlays} />
            )}
          </Controls>

          {overlays.map(config => (
            <OverlayLayer key={config.name} config={config} />
          ))}

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
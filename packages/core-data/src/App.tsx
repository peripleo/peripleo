import { useState, useEffect } from 'react';
import { LayerSwitcher, Map, MixedGeoJSONLayer, Tooltip, Zoom } from '@peripleo/peripleo/maplibre';
import { AppHeader, SearchResultsMapLayer, SearchResultTooltip } from './components';
import {  CoreDataProperties } from './model/lp/CoreDataPlaceFeature';
import { Search, SiteDetails } from './pages';
import { toLayerStyle, useRuntimeConfig } from './CoreDataConfig';
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

  const { baselayers, datalayers } = useRuntimeConfig();

  const [baselayer, setBaselayer] = useState(0);

  const selected = useSelectionValue<CoreDataProperties>();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (selected?.id)
      navigate(`/site/${selected.properties.uuid}`);
  }, [selected?.id]);

  const toggleBaseLayer = () => {
    const next = (baselayer + 1) % baselayers.length;
    setBaselayer(next);
  }

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
          style={toLayerStyle(baselayers[baselayer], `baselayer-${baselayer}`)}>
          <Controls position="topright">
            <Zoom />

            <button 
              onClick={toggleBaseLayer}
              className="p6o-control p6o-control-button">
              Toggle base
            </button>

            {datalayers.length > 0 && (            
              <LayerSwitcher names={datalayers.map(l => l.name)}>
                {datalayers.map(l => (
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
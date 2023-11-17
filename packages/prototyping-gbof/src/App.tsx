import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch';
import { Controls, Feature, FeatureCollection, Peripleo } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { RefinementList, SearchBox, SearchResultList } from './components';

import '@peripleo/peripleo/default-theme';
import { SearchResultsMapLayer } from './components/SearchResultsMapLayer';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const searchResultLayerStyle = {
  'type': 'circle',
  'paint': {
    'circle-radius': 8,
    'circle-stroke-width': 1,
    'circle-color': '#ff623b',
    'circle-stroke-color': '#8d260c'
  }
};

const toGeoJSON = (items: any[]): FeatureCollection => ({
  type: 'FeatureCollection',
  features: items.map(item => ({
    type: 'Feature',
    properties: {...item},
    geometry: {
      type: 'Point',
      coordinates: [
        item._geoloc.lng,
        item._geoloc.lat
      ]
    }
  }) as Feature)
});

export const App = () => {

  return (
    <Peripleo>
      <InstantSearch 
        searchClient={searchClient} 
        indexName="instant_search">

        <Map>
          <SearchResultsMapLayer 
            id="results"
            style={searchResultLayerStyle} 
            toGeoJSON={toGeoJSON} />

          <Controls position="topleft">
            <SearchBox />

            <RefinementList attribute="brand" />

            <SearchResultList />
          </Controls>

          <Controls position="topright">
            <Zoom />
          </Controls>
        </Map>
      </InstantSearch>
    </Peripleo>
  )

}
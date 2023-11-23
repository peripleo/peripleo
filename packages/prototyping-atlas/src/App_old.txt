import { InstantSearch } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { Controls, Feature, FeatureCollection, Peripleo } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';
import { RefinementList, SearchBox, SearchResultList, SearchResultsMapLayer } from './components';

import server from './config.json';

import '@peripleo/peripleo/default-theme';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    ...server
  },
  additionalSearchParameters: {
    query_by: "name,names",
    limit: 250
  }
});

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
        searchClient={typesenseInstantsearchAdapter.searchClient} 
        indexName="georgia_coast_atlas">

        <Map>
          <SearchResultsMapLayer 
            id="results"
            style={searchResultLayerStyle} 
            toGeoJSON={toGeoJSON} />

          <Controls position="topleft">
            <SearchBox />

            <RefinementList attribute="type_facet" />

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
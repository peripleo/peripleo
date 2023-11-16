import algoliasearch from 'algoliasearch/lite';
import { Highlight, Hits, InstantSearch, RefinementList, SearchBox } from 'react-instantsearch';
import { Controls } from '@peripleo/peripleo';
import { Map, Zoom } from '@peripleo/peripleo/maplibre';

import '@peripleo/peripleo/default-theme';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);


function Hit(evt: any) {
  console.log(evt);

  return (
    <>
      <Highlight hit={evt.hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${evt.hit.price}</span>
    </>
  );
}

export const App = () => {

  return (
    <InstantSearch 
      searchClient={searchClient} 
      indexName="instant_search">

      <Map>
        <Controls position="topleft">
          <SearchBox className="p6o-control" />
          <RefinementList className="p6o-control" attribute="brand" />
          <Hits hitComponent={Hit} />
        </Controls>

        <Controls position="topright">
          <Zoom />
        </Controls>
      </Map>
    </InstantSearch>
  )

}
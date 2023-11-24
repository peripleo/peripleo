import { ReactNode } from 'react';
import { InstantSearch } from 'react-instantsearch'; 
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

const { 
  VITE_TS_HOST, 
  VITE_TS_PORT, 
  VITE_TS_PROTOCOL, 
  VITE_TS_API_KEY,
  VITE_TS_INDEX_NAME
} = import.meta.env;

const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
  server: {
    apiKey: VITE_TS_API_KEY,
    nodes: [
      {
        host: VITE_TS_HOST,
        port: VITE_TS_PORT,
        protocol: VITE_TS_PROTOCOL
      }
    ],
    cacheSearchResultsForSeconds: 120
  },
  additionalSearchParameters: {
    query_by: "name,names",
    limit: 100
  }
});

export const TypeSenseSearch = (props: { children: ReactNode }) => {

  return (
    <InstantSearch 
      searchClient={typesenseInstantsearchAdapter.searchClient} 
      indexName={VITE_TS_INDEX_NAME}>
      {props.children}
    </InstantSearch>
  )

}
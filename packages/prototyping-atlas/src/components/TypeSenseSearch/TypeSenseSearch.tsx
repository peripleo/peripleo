import { ReactNode, createContext, useContext } from 'react';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import { 
  InstantSearch, 
  useHits as _useHits, 
  useSearchBox as _useSearchBox 
} from 'react-instantsearch'; 

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

interface PersistentSearchStateContextValue {

  hits: ReturnType<typeof _useHits>;

  searchBox: ReturnType<typeof _useSearchBox>;

}

const PersistentSearchStateContext = createContext<PersistentSearchStateContextValue>(undefined);

/**
 * We are moving the use of the InstantSearch up into the context. This 
 * way the hooks never unmount, and the search state never resets as 
 * UI components get mounted and unmounted.
 */
const PersistentSearchState = (props: { children: ReactNode }) => {
  
  const hits = _useHits();

  const searchBox = _useSearchBox();

  return (
    <PersistentSearchStateContext.Provider value={{ hits, searchBox }}>
      {props.children}
    </PersistentSearchStateContext.Provider>
  )

}

export const TypeSenseSearch = (props: { children: ReactNode }) => {

  return (
    <InstantSearch 
      indexName={VITE_TS_INDEX_NAME}
      searchClient={typesenseInstantsearchAdapter.searchClient}
      future={{
        preserveSharedStateOnUnmount: true
      }}>
      <PersistentSearchState>
        {props.children}
      </PersistentSearchState>
    </InstantSearch>
  )

}

/**
 * Use these hooks as drop-in replacements for InstantSearch-provide hooks.
 */

export const useHits = () => {
  const { hits } = useContext(PersistentSearchStateContext);
  return hits;
}

export const useSearchBox = () => {
  const { searchBox } = useContext(PersistentSearchStateContext);
  return searchBox;
}
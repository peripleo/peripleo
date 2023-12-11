import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import { history } from 'instantsearch.js/es/lib/routers';
import { 
  InstantSearch, 
  useDynamicWidgets,
  useInfiniteHits,
  useSearchBox as _useSearchBox,
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
    limit: 250
  }
});

const routing = {
  router: history(),
  stateMapping: {
    stateToRoute: (state: any) => {
      const uiState = state[VITE_TS_INDEX_NAME];
      return {
        q: uiState.query
      };
    },

    routeToState: (state: any) => {
      return {
        [VITE_TS_INDEX_NAME]: {
          query: state.q
        }
      };
    }
  }
};

interface PersistentSearchStateContextValue {

  cachedHits: any[];

  searchBox: ReturnType<typeof _useSearchBox>;

  facets: string[];

}

const PersistentSearchStateContext = createContext<PersistentSearchStateContextValue>(undefined);

/**
 * We are moving the use of the InstantSearch up into the context. This 
 * way the hooks never unmount, and the search state never resets as 
 * UI components get mounted and unmounted.
 */
const PersistentSearchState = (props: { children: ReactNode }) => {

  const searchBox = _useSearchBox();

  const hits = useInfiniteHits();

  const [cachedHits, setCachedHits] = useState<any[]>([]);

  // For some reason, 'hits' in useInfiniteHits gets set to zero
  // as soon as this hook in used. Only 'currentPageHits' gets filled.
  // Doesn't really matter much, since we are maintaining our own 
  // results cache.
  const { attributesToRender } = useDynamicWidgets({
    facets: ['*']
  });

  useEffect(() => {
    // Add to cache and load next page
    if (hits.isFirstPage)
      setCachedHits(() => hits.currentPageHits);
    else
      setCachedHits(h => ([...h, ...hits.currentPageHits]));

    if (!hits.isLastPage) {
      setTimeout(() => {
        hits.showMore();
      }, 50);
    }
  }, [hits.showMore, hits.results]);
  
  return (
    <PersistentSearchStateContext.Provider value={{ cachedHits, facets: attributesToRender, searchBox }}>
      {props.children}
    </PersistentSearchStateContext.Provider>
  )

}

export const TypeSenseSearch = (props: { children: ReactNode }) => {

  return (
    <InstantSearch 
      indexName={VITE_TS_INDEX_NAME}
      routing={routing}
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

export const useCachedHits = () => {
  const { cachedHits } = useContext(PersistentSearchStateContext);
  return cachedHits;
}

export const useFacets = () => {
  const { facets } = useContext(PersistentSearchStateContext);
  return facets;
}

export const useSearchBox = () => {
  const { searchBox } = useContext(PersistentSearchStateContext);
  return searchBox;
}
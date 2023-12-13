import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import { history } from 'instantsearch.js/es/lib/routers';
import { RefinementListProxy } from './RefinementListProxy';
import { TypeSenseSearchResult } from './TypeSenseSearchResult';
import { 
  InstantSearch, 
  useDynamicWidgets,
  useInfiniteHits,
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
    limit: 250
  }
});

const routing = {
  router: history(),
  stateMapping: {
    stateToRoute: (state: any) => {
      const uiState = state[VITE_TS_INDEX_NAME];
      const { refinementList } = uiState;

      let route = {
        q: uiState.query
      };

      if (refinementList)
        route = {
          ...route,
          ...refinementList
        }

      return route;
    },

    routeToState: (state: any) => {
      const { q, ...facets} = state;
      
      let uiState: any = {
        [VITE_TS_INDEX_NAME]: {
          query: q,
        }
      };

      if (Object.keys(facets).length > 0)
        uiState[VITE_TS_INDEX_NAME].refinementList = facets;

      return uiState;
    }
  }
};

interface PersistentSearchStateContextValue {

  cachedHits: TypeSenseSearchResult[];

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

  const infiniteHits = useInfiniteHits();

  const [cachedHits, setCachedHits] = useState<TypeSenseSearchResult[]>([]);

  // For some reason, 'hits' in useInfiniteHits gets set to zero
  // as soon as this hook in used. Only 'currentPageHits' gets filled.
  // Doesn't really matter much, since we are maintaining our own 
  // results cache.
  const { attributesToRender } = useDynamicWidgets({
    facets: ['*']
  });

  useEffect(() => {
    const { results } = infiniteHits;

    const isFirstPage = results.page === 0;
    const isLastPage = results.page + 1 >= results.nbPages;

    // Add to cache and load next page
    if (isFirstPage)
      setCachedHits(() => results.hits as unknown as TypeSenseSearchResult[]);
    else
      setCachedHits(h => ([...h, ...results.hits as unknown as TypeSenseSearchResult[]]));

    if (!isLastPage && infiniteHits.showMore) {
      setTimeout(() => infiniteHits.showMore(), 25);
    }
  }, [infiniteHits.showMore, infiniteHits.results]);
  
  return (
    <PersistentSearchStateContext.Provider value={{ cachedHits, facets: attributesToRender, searchBox }}>
      {props.children}

      {/* This ensures dynamic attribute refinements stay persistent */}
      {attributesToRender.map(facet => (<RefinementListProxy key={facet} attribute={facet} />))}
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
import { ReactNode, createContext, useContext, useMemo } from 'react';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import { history } from 'instantsearch.js/es/lib/routers';
import { CoreDataConfig, useRuntimeConfig } from '../../CoreDataConfig';
import { RefinementListProxy } from './RefinementListProxy';
import { TypeSenseSearchResult } from './TypeSenseSearchResult';
import { 
  InstantSearch, 
  useDynamicWidgets,
  useGeoSearch as _useGeoSearch,
  useSearchBox as _useSearchBox,
} from 'react-instantsearch'; 
import { useProgressiveSearch } from './useProgressiveSearch';

const createTypesenseAdapter = (config: CoreDataConfig) => 
  new TypesenseInstantsearchAdapter({
    server: {
      apiKey: config.typesense.api_key,
      nodes: [
        {
          host: config.typesense.host,
          port: config.typesense.port || 443,
          protocol: config.typesense.protocol || 'https'
        }
      ],
      cacheSearchResultsForSeconds: 120
    },
    geoLocationField: "coordinates",
    additionalSearchParameters: {
      query_by: config.typesense.query_by,
      limit: config.typesense.limit || 250
    }
  });

const createRouting = (config: CoreDataConfig) => ({
  router: history(),
  stateMapping: {
    stateToRoute: (state: any) => {
      const uiState = state[config.typesense.index_name];
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
        [config.typesense.index_name]: {
          query: q,
        }
      };

      if (Object.keys(facets).length > 0)
        uiState[config.typesense.index_name].refinementList = facets;

      return uiState;
    }
  }
});
  
interface PersistentSearchStateContextValue {

  cachedHits: TypeSenseSearchResult[];

  facets: string[];

  geoSearch: ReturnType<typeof _useGeoSearch>;

  searchBox: ReturnType<typeof _useSearchBox>;

}

const PersistentSearchStateContext = createContext<PersistentSearchStateContextValue>(undefined);

/**
 * We are moving the use of the InstantSearch up into the context. This 
 * way the hooks never unmount, and the search state never resets as 
 * UI components get mounted and unmounted.
 */
const PersistentSearchState = (props: { children: ReactNode }) => {

  const searchBox = _useSearchBox();

  const { cachedHits, geoSearch } = useProgressiveSearch();

  // For some reason, 'hits' in useInfiniteHits gets set to zero
  // as soon as this hook in used. Only 'currentPageHits' gets filled.
  // Doesn't really matter much, since we are maintaining our own 
  // results cache.
  const { attributesToRender } = useDynamicWidgets({
    facets: ['*']
  });

  return (
    <PersistentSearchStateContext.Provider value={{ 
      cachedHits, 
      facets: attributesToRender, 
      geoSearch,
      searchBox
    }}>

      {props.children}

      {/* This ensures dynamic attribute refinements stay persistent */}
      {attributesToRender.map(facet => (<RefinementListProxy key={facet} attribute={facet} />))}
    </PersistentSearchStateContext.Provider>
  )

}

export const TypeSenseSearch = (props: { children: ReactNode }) => {

  const config = useRuntimeConfig();

  const adapter = useMemo(() => createTypesenseAdapter(config), []);

  const routing = useMemo(() => createRouting(config), []);
  
  return (
    <InstantSearch 
      indexName={config.typesense.index_name}
      routing={routing}
      searchClient={adapter.searchClient}
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

export const useGeoSearch = () => {
  const { geoSearch } = useContext(PersistentSearchStateContext);
  return geoSearch;
}
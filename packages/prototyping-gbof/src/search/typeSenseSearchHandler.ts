import { SearchArgs, SearchResult, Store } from '@peripleo/peripleo';

export const createTypeSenseSearchHandler = <T extends unknown, S extends unknown>() => {

  const onSearch = (arg: { args: SearchArgs, store: Store<T> }): SearchResult<S> => {

    console.log('running search', arg);

    // TODO
    return {
      total: 0,
      items: [],
      bounds: { minnLon: -180, minLat: -90, maxLon: 180, maxLat: 90 }
      // aggregations
    }
  } 

  return onSearch;

} 
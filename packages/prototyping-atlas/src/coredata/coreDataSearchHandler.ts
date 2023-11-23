import { SearchArgs, SearchResult } from '@peripleo/peripleo';
import { CoreDataPlace } from './Types';

export const createCoreDataSearchHandler = () => {

  const onSearch = (arg: { args: SearchArgs }) => new Promise<SearchResult<CoreDataPlace>>((resolve, reject) => {

    console.log('query:', arg.args.query);
    
    // TODO
    resolve({
      total: 0,
      items: [],
      bounds: { minnLon: -180, minLat: -90, maxLon: 180, maxLat: 90 }
      // aggregations
    });

  });

  return onSearch;

} 
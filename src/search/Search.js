import { SearchArgs } from './SearchArgs';

export class Search {

  constructor(args, result, status) {
    this.args = args || new SearchArgs({});
    this.result = result;
    this.status = status || Search.PENDING;
  }

  hasAnyFilters = () =>
    this.args.filters.length > 0;

  hasFilter = filter =>
    this.args.filters.find(f => f.equals(filter));

}

Search.all = () => new Search();

Search.OK = 'OK';
Search.ERROR = 'ERROR';
Search.PENDING = 'PENDING';

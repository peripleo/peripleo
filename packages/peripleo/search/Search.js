export const SearchStatus = {
  OK: 'OK',
  ERROR: 'ERROR',
  LOADING: 'LOADING'
}

export default class Search {

  constructor(args, result, status) {
    this.args = args;
    this.result = result;
    this.status = status;
  }

  hasAnyFilters = () =>
    this.args.filters.length > 0;

  hasFilter = filter =>
    this.args.filters.find(f => f.equals(filter));

}
export default class SearchArgs {

  constructor(query, filters, currentFacet, fitMap) {
    this.query = query;

    this.filters = filters || [];

    this.currentFacet = currentFacet;

    this.fitMap = !!fitMap;
  }

  clone = () =>
    new SearchArgs(this.query, this.filters, this.currentFacet, this.fitMap);

}
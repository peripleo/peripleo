export class SearchArgs {

  constructor({ query, filters, currentFacet, fitMap}) {
    this.query = query;

    this.filters = filters || [];

    this.currentFacet = currentFacet;

    this.fitMap = !!fitMap;
  }

}
import bbox from '@turf/bbox';

export default class SearchResult {

  constructor(items, facetDistribution, total) {

    this.total = total || items.length;

    this.items = items || [];

    this.facetDistribution = facetDistribution;

  }

  clone = () =>
    new SearchResult(this.items, this.facetDistribution, this.total);

  bounds = () => {
    if (this.items?.length > 0) {
      const [ minX, minY, maxX, maxY ] = bbox({ 
        type: 'FeatureCollection', 
        features: this.items 
      });

      return [ [minX, minY], [maxX, maxY] ];
    } else {
      return null;
    }
  }

}
import { useEffect, useRef, useState } from 'react';
import { useInfiniteHits, useGeoSearch as _useGeoSearch } from 'react-instantsearch';
import { useMap } from '@peripleo/peripleo/maplibre';
import { dequal } from 'dequal/lite';
import bbox from '@turf/bbox';
import type { TypeSenseSearchResult } from './TypeSenseSearchResult';

const createCachedHits = (hits: TypeSenseSearchResult[]) => {

  const ids = new Set(hits.map(h => h.record_id));

  // De-duplication: drop all hits that are already in the list, append the rest
  const merge = (toMerge: TypeSenseSearchResult[]) => {
    const toAppend = toMerge.filter(h => !ids.has(h.record_id));
    return createCachedHits([...hits, ...toAppend]);
  }

  return { hits, merge };

}

export const useProgressiveSearch = () => {

  const infiniteHits = useInfiniteHits();

  const geoSearch = _useGeoSearch();

  const [cachedHits, setCachedHits] = useState(createCachedHits([]));

  const lastSearchState = useRef<any>();

  const map = useMap();

  useEffect(() => {
    const { results } = infiniteHits;

    const isFirstPage = results.page === 0;
    const isLastPage = results.page + 1 >= results.nbPages;

    // Add to cache and load next page
    if (isFirstPage) {
      setCachedHits(() => createCachedHits(results.hits as unknown as TypeSenseSearchResult[]));
    } else {
      setCachedHits(({ merge }) => merge(results.hits as unknown as TypeSenseSearchResult[]));
    }

    if (!isLastPage && infiniteHits.showMore) {
      setTimeout(() => infiniteHits.showMore(), 25);
    } else {
      const hasHits = cachedHits.hits.length > 0 && results.hits.length > 0;
      const hasStateChanged = !dequal(results._state, lastSearchState.current);

      const isBoundsFilterActive = geoSearch.isRefinedWithMap();

      if (map && hasHits && hasStateChanged && !isBoundsFilterActive) {      
        const features = {
          type: 'FeatureCollection',
          features: cachedHits.hits
            // For some reason, 0/0 points throw turf off :-(
            .filter(h => 'geometry' in h && (h.coordinates[0] !== 0 || h.coordinates[1] !== 0))
        };

        const [minX, minY, maxX, maxY] = bbox(features);
        map.fitBounds([[minX, minY], [maxX, maxY]], { 
          padding: 100,
          maxZoom: 14
        });
      }
    }

    lastSearchState.current = results._state;
  }, [infiniteHits.results]);

  return { cachedHits: cachedHits.hits, geoSearch };

}
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInfiniteHits, useGeoSearch as _useGeoSearch } from 'react-instantsearch';
import { dequal } from 'dequal/lite';
import type { TypeSenseSearchResult } from './TypeSenseSearchResult';
import { normalizeResults } from './normalizeResults';

const createCachedHits = (hits: TypeSenseSearchResult[]) => {

  const ids = new Set(hits.map(h => h.uuid));

  // De-duplication: drop all hits that are already in the list, append the rest
  const merge = (toMerge: TypeSenseSearchResult[]) => {
    const toAppend = toMerge.filter(h => !ids.has(h.uuid));
    return createCachedHits([...hits, ...toAppend]);
  }

  return { hits, merge };

}

type OnCompleteCallback = (results: TypeSenseSearchResult[]) => void;

export const useProgressiveSearch = () => {

  const infiniteHits = useInfiniteHits();

  const geoSearch = _useGeoSearch();

  const [cachedHits, setCachedHits] = useState(createCachedHits([]));

  const lastSearchState = useRef<any>();

  const callbacks = useRef<OnCompleteCallback[]>([]);

  const observe = useCallback((callback: OnCompleteCallback) => {
    callbacks.current = [...callbacks.current, callback];
  }, []);

  const unobserve = useCallback((callback: OnCompleteCallback) => {
    callbacks.current = callbacks.current.filter(c => c !== callback)
  }, []);

  const hasStateChanged = (a: any, b: any, ignorePageNo?: boolean) => {
    if (ignorePageNo && a)
      delete a.page;
  
    if (ignorePageNo && b)
      delete b.page;

    return !dequal(a, b);
  }

  useEffect(() => {
    const { results } = infiniteHits;

    const isFirstPage = results.page === 0;
    const isLastPage = results.page + 1 >= results.nbPages;

    const hits = normalizeResults(results.hits as unknown as TypeSenseSearchResult[])

    // Add to cache and load next page
    if (isFirstPage && hasStateChanged(results._state, lastSearchState.current, true)) {
      setCachedHits(() => createCachedHits(hits));
    } else {
      setCachedHits(({ merge }) => merge(hits));
    }

    if (!isLastPage && infiniteHits.showMore) {
      setTimeout(() => infiniteHits.showMore(), 25);
    } else {
      if (hasStateChanged(results._state, lastSearchState.current)) {
        callbacks.current.forEach(callback => {
          const merged = cachedHits.merge(hits);
          callback(merged.hits);
        });
      }
    }

    lastSearchState.current = results._state;
  }, [infiniteHits.results]);

  return { cachedHits: cachedHits.hits, geoSearch, observe, unobserve };

}
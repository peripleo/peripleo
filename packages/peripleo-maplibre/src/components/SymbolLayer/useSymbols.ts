import { useEffect, useMemo, useState } from 'react';
import { Map } from 'maplibre-gl';
import { SymbolsMap } from './SymbolsMap';

const removeImage = (map: Map, id: string) => {
  if (!map?.getImage(id)) return;
  map.removeImage(id);
}

export const useSymbols = (map: Map, symbols: string | SymbolsMap) => {

  const [idOrIds, setIdOrIds] = useState<string | string[] | undefined>();

  // A trick to re-renders only if symbols changes by value rather than object reference
  const memoizedSymbols = useMemo(() => {
    return symbols;
  }, [JSON.stringify(symbols)])

  useEffect(() => {
    if (!map || !memoizedSymbols) return;

    if (typeof memoizedSymbols === 'string') {
      // Single symbol - use URL as identifier
      map.loadImage(memoizedSymbols).then(image => {
        map.addImage(memoizedSymbols, image.data);
        setIdOrIds(memoizedSymbols);
      });

      return () => {
        removeImage(map, memoizedSymbols);
      }
    } else {
      // key/value map. Load all images and use keys as identifiers
      Promise.all(Object.entries(memoizedSymbols).map(([id, url]) => {
        return map.loadImage(url).then(image => ({ id, image}));
      })).then(results => {
        // Add loaded images to map
        results.forEach(r => map.addImage(r.id, r.image.data));

        // Return identifiers
        const ids = results.map(r => r.id);
        setIdOrIds(ids);
      });

      return () => {
        Object.keys(memoizedSymbols).forEach(id => removeImage(map, id));
      }
    }
  }, [map, memoizedSymbols]);

  return idOrIds;

}
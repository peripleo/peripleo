import { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Settings2, X } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import * as Switch from '@radix-ui/react-switch';
import { useMap } from '@peripleo/maplibre';
import { useFacets, useGeoSearch } from '../TypeSenseSearch';
import { RefinementList, useCurrentRefinements } from 'react-instantsearch';

import './SearchFilterSettings.css';

const decodeFacet = (key: string): { key: string, label: string, facet: boolean, uuid?: string } => {
  if (key.startsWith('ey')) {
    return { key, ...jwtDecode(key) };
  } else if (key.includes('.ey')) {
    return { key, ...jwtDecode(key.substring(key.indexOf('.ey') + 1)) };
  } else {
    return {
      key,
      label: key
        .substring(0, key.lastIndexOf('_'))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      facet: true
    }
  }
}

export const SearchFilterSettings = () => {

  const [open, setOpen] = useState(false);

  const facets = useFacets();

  const decoded = useMemo(() => facets.map(decodeFacet), [facets]);

  useEffect(() => {
    console.log(decoded);
  }, [decoded.map(d => d.key).join()]);

  const map = useMap();
  
  const { refine, clearMapRefinement, isRefinedWithMap} = useGeoSearch();

  const [filterByMapBounds, setFilterByMapBounds] = useState(isRefinedWithMap());

  const { items } = useCurrentRefinements();

  useEffect(() => {
    if (!map)
      return;

    if (filterByMapBounds) {
      const onChangeViewport = () => {
        const bounds = map.getBounds();

        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();

        // Note TypeSense seems to be buggy. If the bounds are too large,
        // it will return 0 results. (Note that lng values >180, <(-180) DO NOT
        // seem to be the problem!)
        const extent = northEast.lng - southWest.lng;
        if (extent > 200) {
          clearMapRefinement();
        } else {
          refine({
            northEast,
            southWest
          });
        }
      }

      onChangeViewport(); // Initial filter

      map.on('dragend', onChangeViewport);
      map.on('zoomend', onChangeViewport);

      return () => {
        map.off('dragend', onChangeViewport);
        map.off('zoomend', onChangeViewport);
      }
    } else {
      clearMapRefinement();
    }   
  }, [map, filterByMapBounds]);

  const filtersApplied = items.length + (filterByMapBounds ? 1 : 0);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger 
        onClick={() => setOpen(open => !open)}
        className="relative p-2 rounded-full hover:bg-slate-300 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
        <Settings2 className="h-4 w-4" />
        
        {filtersApplied > 0 && (
          <div className="absolute -top-[6px] -right-[6px] w-[19px] h-[19px]
            text-[11px] font-medium rounded-full flex justify-center items-center bg-teal-700 text-white">
            {filtersApplied}
          </div>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
          side="right" 
          sideOffset={20}
          align="start"
          alignOffset={-5}
          className="bg-white/80 max-h-[90vh] overflow-y-auto backdrop-blur z-20 shadow-md rounded-md w-72 max-w-lg p-4 outline-none">

          <div>
            <h1 className="w-full items-center font-medium text-black">
              <Settings2 className="h-4 w-4 inline align-text-bottom mb-0.5" /> Filters
            </h1>

            <div className="flex items-center text-sm mt-5">
              <Switch.Root 
                id="toggle-bounds-filter"
                className="switch-root"
                checked={filterByMapBounds}
                onCheckedChange={checked => setFilterByMapBounds(Boolean(checked))}>
                <Switch.Thumb className="switch-thumb" />
              </Switch.Root>

              <label 
                className="ml-2"
                htmlFor="toggle-bounds-filter">Filter by map bounds</label>
            </div>

            <div>
              {decoded.filter(f => f.facet).map(facet => (
                <div key={facet.uuid || facet.key}>
                  <h2 className="mt-5 font-semibold text-sm mb-2">{facet.label}</h2>

                  <RefinementList attribute={facet.key} />
                </div>
              ))}
            </div>
          </div>

          <Popover.Close
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
            <X className="h-4 w-4" />
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>    
    </Popover.Root>
  )

}
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Settings2, X } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useFacets } from '../TypeSenseSearch';
import { RefinementList, useCurrentRefinements } from 'react-instantsearch';
import { RefinementListProxy } from './RefinementListProxy';

import './SearchFilterSettings.css';

export const SearchFilterSettings = () => {

  const [open, setOpen] = useState(false);

  const facets = useFacets();

  const { items } = useCurrentRefinements();

  // Simple formatting strategy: get rid of _facet and capitalize
  const format = (attribute: string): string => {
    if (attribute.startsWith('ey')) {
      const payload = jwtDecode(attribute);
      return 'label' in payload ? payload.label as string : attribute;
    } else {
      return attribute
        .substring(0, attribute.lastIndexOf('_'))
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  return (
    <Popover.Root open={open}>
      <Popover.Trigger 
        onClick={() => setOpen(open => !open)}
        className="relative p-2 rounded-full hover:bg-slate-300 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
        <Settings2 className="h-4 w-4" />
        {facets.map(facet => (<RefinementListProxy key={facet} attribute={facet} />))}

        {items.length > 0 && (
          <div className="absolute -top-[6px] -right-[6px] w-[19px] h-[19px]
            text-[11px] font-medium rounded-full flex justify-center items-center bg-teal-700 text-white">
            {items.length}
          </div>
        )}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content 
          side="right" 
          sideOffset={20}
          align="start"
          alignOffset={-5}
          className="bg-white/80 backdrop-blur z-20 shadow-md rounded-md w-72 max-w-lg p-4 outline-none">

          <div>
            <h1 className="w-full items-center font-medium text-black">
              <Settings2 className="h-4 w-4 inline align-text-bottom mb-0.5" /> Filters
            </h1>

            <div>
              {facets.map(facet => (
                <div key={facet}>
                  <h2 className="mt-5 font-semibold text-sm mb-2">{format(facet)}</h2>

                  <RefinementList attribute={facet} />
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
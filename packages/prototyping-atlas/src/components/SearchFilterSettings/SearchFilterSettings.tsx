import { jwtDecode } from 'jwt-decode';
import { Settings2 } from 'lucide-react';
import { useFacets } from '../TypeSenseSearch';

import './SearchFilterSettings.css';
import { RefinementList } from 'react-instantsearch';

export const SearchFilterSettings = () => {

  const facets = useFacets();

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
  )

}
import { RefinementList } from 'react-instantsearch';
import { Settings2 } from 'lucide-react';

import './SearchFilterSettings.css';

export const SearchFilterSettings = () => {

  return (
    <div>
      <h1 className="w-full items-center font-medium text-black">
        <Settings2 className="h-4 w-4 inline align-text-bottom mb-0.5" /> Filters
      </h1>

      <div>
        <h2 className="mt-5 font-semibold text-sm mb-2">Types</h2>
        <RefinementList attribute="type_facet" />
      </div>
    </div>
  )

}
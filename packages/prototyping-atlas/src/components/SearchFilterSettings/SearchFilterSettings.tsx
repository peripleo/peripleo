import { RefinementList } from 'react-instantsearch';
import { Settings2 } from 'lucide-react';

export const SearchFilterSettings = () => {

  return (
    <div>
      <h1 className="w-full items-center font-medium text-black">
        <Settings2 className="h-4 w-4 inline align-text-bottom mb-0.5" /> Filters
      </h1>
      
      <div className="text-muted text-sm mt-4">
        <RefinementList attribute="type_facet" />
      </div>
    </div>
  )

}
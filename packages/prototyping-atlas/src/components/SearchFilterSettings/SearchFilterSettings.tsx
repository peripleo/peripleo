import { RefinementList } from 'react-instantsearch';
import { Settings2 } from 'lucide-react';

export const SearchFilterSettings = () => {

  return (
    <div>
      <h1 className="flex gap-2 w-full items-center font-medium text-black">
        <Settings2 strokeWidth={2.5} className="h-4 w-4" /> Filters
      </h1>
      
      <div className="text-muted text-sm mt-4">
        <RefinementList attribute="type_facet" />
      </div>
    </div>
  )

}
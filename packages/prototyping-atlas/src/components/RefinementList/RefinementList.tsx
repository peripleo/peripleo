import { RefinementList as InstantSearchRefinementList, RefinementListProps } from 'react-instantsearch';

export const RefinementList = () => {

  return (
    <div className="p6o-control">
      <InstantSearchRefinementList attribute="type_facet" />
    </div>
  )

}
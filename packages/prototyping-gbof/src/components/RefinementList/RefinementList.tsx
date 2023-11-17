import { RefinementList as InstantSearchRefinementList, RefinementListProps } from 'react-instantsearch';

export const RefinementList = (props: RefinementListProps) => {

  // TODO wrap this in a modal dialog or a Radix popover

  return (
    <div className="p6o-control">
      <InstantSearchRefinementList {...props} />
    </div>
  )

}
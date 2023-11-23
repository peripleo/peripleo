import { Highlight, Hits } from 'react-instantsearch';

const HitComponent = ({ hit }: { hit: any }) => {

  return (
    <div className="py-1 px-3 h-[4em] flex items-center border-b">
      <Highlight hit={hit} attribute="name" className="Hit-label" />
    </div>
  );
}


export const SearchResultList = () => {

  return (
    <Hits 
      className="text-sm" 
      hitComponent={HitComponent} />
  )
  
}
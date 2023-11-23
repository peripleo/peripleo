import { Highlight, Hits } from 'react-instantsearch';

const HitComponent = ({ hit }: { hit: any }) => {

  return (
    <div className="rounded-lg bg-white py-1 px-3 mb-1 shadow w-[300px] flex justify-between border">
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </div>
  );
}


export const SearchResultList = () => {

  return (
    <Hits 
      className="p6o-control"
      hitComponent={HitComponent} />
  )
  
}
import { Highlight, Hits } from 'react-instantsearch';

const HitComponent = ({ hit }: { hit: any }) => {

  return (
    <div className="py-2 px-3 h-[5.5em] border-b flex flex-col justify-start">
      <Highlight hit={hit} attribute="name" />
      <p className="text-muted text-xs line-clamp-1">
        <Highlight hit={hit} attribute={"names"} />
      </p>
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
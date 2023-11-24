import { useHoverValue } from '@peripleo/peripleo';
import { Highlight, InfiniteHits } from 'react-instantsearch';

import './SearchResultList.css';

const HitComponent = ({ hit }: { hit: any }) => {

  const hover = useHoverValue();

  const isHovered = hover?.properties.id === hit.id;

  const cls = "py-2 px-3 h-[5.5em] border-b flex flex-col justify-start";

  return (
    <div 
      className={isHovered ? `bg-teal-700/30 ${cls}` : cls}>
      <Highlight hit={hit} attribute="name" />
      <p className="text-muted text-xs line-clamp-1">
        <Highlight hit={hit} attribute={"names"} /> {hit.id}
      </p>
    </div>
  );
}

export const SearchResultList = () => {
  
  return (
    <InfiniteHits 
      className="text-sm" 
      showPrevious={false}
      hitComponent={HitComponent} />
  )
  
}
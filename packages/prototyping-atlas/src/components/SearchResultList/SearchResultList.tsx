import { Link } from 'react-router-dom';
import { useHoverState } from '@peripleo/peripleo';
import { Highlight, InfiniteHits } from 'react-instantsearch';

import './SearchResultList.css';

const HitComponent = ({ hit }: { hit: any }) => {

  const { hover, setHover } = useHoverState();

  const isHovered = hover?.properties.id === hit.id;

  const cls = "py-2 px-3 h-[5.5em] border-b flex flex-col justify-start";

  const onPointerEnter = () => {
    setHover({...hit, properties: { id: hit.id }});
  }

  const onPointerLeave = () => {

  }

  return (
    <div 
      className={isHovered ? `bg-teal-700/30 ${cls}` : cls}>
      <Link 
        to={`/site/${hit.id}`}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}>

        <Highlight hit={hit} attribute="name" />
        <p className="text-muted text-xs line-clamp-1">
          <Highlight hit={hit} attribute={"names"} /> {hit.id}
        </p>

      </Link>
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
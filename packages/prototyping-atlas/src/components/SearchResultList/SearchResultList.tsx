import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { Link } from 'react-router-dom';
import { useHoverState } from '@peripleo/peripleo';
import { Highlight } from 'react-instantsearch';
import { useInfiniteHits } from '../TypeSenseSearch';

import './SearchResultList.css';

interface HitComponentProps {

  hit: any;

  isHovered: boolean;

  onPointerEnter(): void;

}

const HitComponent = (props: HitComponentProps) => {

  const { hit } = props;

  const cls = "py-2 px-3 h-[5.5em] border-b flex flex-col justify-start";

  return (
    <div 
      className={props.isHovered ? `bg-teal-700/30 ${cls}` : cls}
      onPointerEnter={props.onPointerEnter}>
      <Link 
        to={`/site/${hit.id}`}>
        <Highlight hit={hit} attribute="name" />
        <p className="text-muted text-xs line-clamp-1">
          <Highlight hit={hit} attribute={"names"} /> {hit.id}
        </p>
      </Link>
    </div>
  );
}

export const SearchResultList = () => {

  const hits = useInfiniteHits();

  const { hover, setHover } = useHoverState();

  const onPointerEnter = (hit: any) => () =>
    setHover({...hit, properties: { id: hit.id }});

  const Row = ({ index, style}) => {
    const hit = hits.hits[index];
    
    return (
      <div style={style}>
        <HitComponent 
          hit={hit} 
          isHovered={hover?.id == hit.id}
          onPointerEnter={onPointerEnter(hits.hits[index])} />
      </div>
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          itemCount={hits.hits.length}
          width={width}
          itemSize={88}>
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
  
}
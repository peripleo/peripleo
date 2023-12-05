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

}

const HitComponent = (props: HitComponentProps) => {

  const { hit } = props;

  const cls = "py-2 px-3 h-[5.5em] border-b flex flex-col justify-start";

  return (
    <div 
      className={props.isHovered ? `bg-teal-700/30 ${cls}` : cls}>
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

  const { hits } = useInfiniteHits();

  const { hover, setHover } = useHoverState();

  const Row = ({ index, style}) => {
    const hit = hits[index];
    
    return (
      <div 
        style={style} 
        // @ts-ignore
        onPointerEnter={() => setHover(hover => hover?.id == hit.id 
          ? hover : {...hit, properties: { id: hit.id }})}>
        <HitComponent 
          hit={hit} 
          isHovered={hover?.id == hit?.id} />
      </div>
    )
  }

  return (
    <AutoSizer>
      {({ height, width }) => (
        <FixedSizeList
          height={height}
          itemCount={hits.length}
          width={width}
          itemSize={88}>
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
  
}
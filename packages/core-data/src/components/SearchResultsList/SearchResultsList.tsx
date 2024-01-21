import { FixedSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { Link, useHoverState } from '@peripleo/peripleo';
import { Highlight } from 'react-instantsearch';
import { toFeature, useCachedHits } from '../TypeSenseSearch';

import './SearchResultsList.css';


interface HitComponentProps {

  hit: any;

  isHovered: boolean;

}

const HitComponent = (props: HitComponentProps) => {

  const { hit } = props;

  const cls = "h-[5.5em] border-b flex flex-col justify-start";

  return (
    <div 
      className={props.isHovered ? `bg-teal-700/30 ${cls}` : cls}>
      <Link 
        className="py-2 px-3 flex-grow"
        to={`/site/${hit.uuid}`}>
        <Highlight hit={hit} attribute="name" className="line-clamp-2" />
        <p className="text-muted text-xs line-clamp-1">
          <Highlight hit={hit} attribute={"names"} />
        </p>
      </Link>
    </div>
  );
}

export const SearchResultsList = () => {

  const hits = useCachedHits();

  const { hover, setHover } = useHoverState();

  const Row = ({ index, style}) => {
    const hit = hits[index];
    const id = parseInt(hit.record_id);
    
    return (
      <div 
        style={style} 
        onPointerEnter={() => setHover(hover => hover?.id === id ? hover : toFeature(hit))}
        onPointerLeave={() => setHover(undefined)}>
        <HitComponent 
          hit={hit} 
          isHovered={hover?.id === parseInt(hit?.record_id)} />
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
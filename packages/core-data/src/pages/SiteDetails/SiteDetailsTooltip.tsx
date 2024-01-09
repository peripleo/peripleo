import { Feature } from '@peripleo/peripleo';
import { CoreDataPlace } from 'src/model';

interface SiteDetailsTooltipProps {

  target: Feature<CoreDataPlace>;
  
}

export const SiteDetailsTooltip = (props: SiteDetailsTooltipProps) => {

  const { title } = props.target.properties;

  return (
    <div className="rounded px-2 py-1.5 text-sm shadow bg-black text-white">
      {title?.length > 30 ? (
        <span>{title.substring(0, 30).trim()}...</span>
      ) : (
        <span>{title}</span>
      )}
    </div>
  )

}
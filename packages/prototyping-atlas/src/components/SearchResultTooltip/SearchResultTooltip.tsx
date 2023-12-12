import { Feature, FeatureCluster } from '@peripleo/peripleo';

interface SearchResultTooltipProps {

  target: Feature | FeatureCluster;

  event: MouseEvent;

}

export const SearchResultTooltip = (props: SearchResultTooltipProps) => {

  const isCluster = 'clusterId' in props.target;

  const feature = isCluster 
    ? (props.target as FeatureCluster<{ name: string}>).features[0] 
    : (props.target as Feature<{ name: string}>);

  const more = isCluster
    ? (props.target as FeatureCluster<{ name: string}>).features.length - 1
    : 0; 

  return (
    <div className="rounded px-2 py-1.5 text-sm shadow bg-black text-white">
      {feature.properties.name.length > 30 ? (
        <span>{feature.properties.name.substring(0, 30).trim()}...</span>
      ) : (
        <span>{feature.properties.name}</span>
      )}
      {more > 0 && (
        <span className="text-white/60 pl-2">+{more} more</span>
      )}
    </div>
  )

}
import { Feature, FeatureCluster } from '@peripleo/peripleo';

interface SearchResultTooltipProps {

  target: Feature | FeatureCluster;

  event: MouseEvent;

}

export const SearchResultTooltip = (props: SearchResultTooltipProps) => {

  console.log(props.target);

  return (
    <div>Hello!</div>
  )

}
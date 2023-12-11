import { useRefinementList } from 'react-instantsearch';

interface RefinementListProxyProps {

  attribute: string;

}

export const RefinementListProxy = (props: RefinementListProxyProps) => {

  // Just a trick to have an empty component that keeps this 
  // facet mounted, while the GUI element mounts and unmounts 
  const proxy = useRefinementList(props);

  return null;

}
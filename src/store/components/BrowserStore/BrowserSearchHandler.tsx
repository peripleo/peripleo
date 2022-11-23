import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { BrowserGraph } from './browserGraph';
import { useGraph } from '../../hooks';
import { searchState } from '../../state';
import { SearchStatus } from '../../types';

export const BrowserSearchHandler = (props: { children: React.ReactElement }) => {

  const graph = useGraph() as BrowserGraph;

  const [search, setSearchState] = useRecoilState(searchState);

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      const items = search.args.query ? 
        graph.search(search.args.query) :
        graph.getAllFeatures();
        
      const total = items.reduce((total, feature) =>
        total + (feature.properties?.count || 1), 0);
  
      setSearchState({
        args: search.args,
        status: SearchStatus.OK,
        result: { total, items }
      });
    }
  }, [search]);

  useEffect(() => {
    setSearchState({ args: {}, status: SearchStatus.PENDING });
  }, [graph]);

  return props.children;

}
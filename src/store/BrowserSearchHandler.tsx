import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useGraph, BrowserGraph } from './graph';
import { searchState, SearchStatus } from './search';

export const BrowserSearchHandler = (props: { children: React.ReactElement }) => {

  const graph = useGraph() as BrowserGraph;

  const [search, setSearchState] = useRecoilState(searchState);

  useEffect(() => {
    if (search.status === SearchStatus.PENDING) {
      const items = graph.getAllFeatures();
  
      const total = items.reduce((total, feature) =>
        total + feature.properties.count, 0);
  
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
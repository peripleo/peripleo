import React from 'react';
import { useSearch } from '../../store';
import { AggregationsProps } from './AggregationsProps';
import { AggregationsCarousel } from './components';

import './AggregationsFullscreen.css';

export const AggregationsFullscreen = (props: AggregationsProps) => {

  const { search, setFilter, setActiveAggregation } = useSearch();

  const aggregations: string[] = search.result?.aggregations ?
    Object.keys(search.result.aggregations) : [];

  const displayed = props.displayFacets || aggregations;

  const activeAggregation = search.args.activeAggregation || displayed[0] || '';

  return (
    <div className="p6o-aggs p6o-aggs-fullscreen">
      <AggregationsCarousel 
        aggregations={displayed} 
        activeAggregation={activeAggregation}
        onChangeAggregation={setActiveAggregation} />
    </div>
  )

}
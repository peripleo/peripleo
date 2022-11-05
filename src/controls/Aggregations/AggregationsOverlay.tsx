import React from 'react';
import { useSearch } from '../../store';
import { AggregationsCarousel, AggregationValueList } from './components';

import './AggregationsOverlay.css';

type AggregationsOverlayProps = {

  colors: { [ key: string ]: string }

  displayFacets?: string[]

}

export const AggregationsOverlay = (props: AggregationsOverlayProps) => {

  const { search, setFilter, setActiveAggregation } = useSearch();
  
  const aggregations: string[] = search.result?.aggregations ?
    Object.keys(search.result.aggregations) : [];

  const displayed = props.displayFacets || aggregations;

  const activeAggregation = search.args.activeAggregation || displayed[0] || '';

  const filterValues: string[] = search.args.filters?.find(f => f.name === activeAggregation)?.values || [];

  const onToggleFilterValue = (value: string) => () => {
    const updated = filterValues.includes(value) ?
      { name: activeAggregation, values: filterValues.filter(str => str !== value) } :
      { name: activeAggregation, values: [...filterValues, value ]};
    
    setFilter(updated);
  }

  return (
    <div className="p6o-aggs">
      <AggregationsCarousel 
        aggregations={displayed} 
        activeAggregation={activeAggregation}
        onChangeAggregation={setActiveAggregation} />

      {search.result?.aggregations &&
        <AggregationValueList
          buckets={search.result.aggregations[activeAggregation].buckets} 
          colors={props.colors} 
          filterValues={filterValues} 
          onToggleFilterValue={onToggleFilterValue} />
      }
    </div>
  )

}
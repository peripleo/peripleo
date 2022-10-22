import React from 'react';
import chroma from 'chroma-js';
import { 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight 
} from 'react-icons/hi';
import { useSearch } from '../../store';

import './AggregationsControls.css';

const formatNumber = (num: number) => {
  if (num > 1000)
    return (num / 1000).toFixed(1) + 'k';
  else if (num > 1000000)
    return (num / 1000000).toFixed(1) + 'M';
  else 
    return num;
}

type AggregationsControlProps = {

  colors: { [ key: string ]: string }

  displayFacets?: string[]

}

export const AggregationsControl = (props: AggregationsControlProps) => {

  const { search, setFilter, setActiveAggregation } = useSearch();
  
  const aggregations: string[] = search.result?.aggregations ?
    Object.keys(search.result.aggregations) : [];

  const displayed = props.displayFacets || aggregations;

  const activeAggregation = search.args.activeAggregation || displayed[0] || '';

  const filterValues: string[] = search.args.filters?.find(f => f.name === activeAggregation)?.values || [];

  const onChangeFacet = (inc: number) => () => {
    const { length } = displayed;
    const currentIdx = displayed.indexOf(activeAggregation);
    const updatedIdx = (currentIdx + inc + length) % length;
    setActiveAggregation(displayed[updatedIdx]);
  }

  const onToggleValue = (value: string) => () => {
    const updated = filterValues.includes(value) ?
      { name: activeAggregation, values: filterValues.filter(str => str !== value) } :
      { name: activeAggregation, values: [...filterValues, value ]};
    
    setFilter(updated);
  }

  return (
    <div className="p6o-aggs">
      <div className="p6o-aggs-carousel">
        <button 
          tabIndex={4}
          aria-label="Previous filter category"
          onClick={onChangeFacet(-1)}>
          <HiOutlineChevronLeft />
        </button>
          
        <h3 
          aria-live="polite"
          aria-atomic={true}>
          {activeAggregation}
        </h3>
        
        <button
          tabIndex={5}
          aria-label="Next filter category"
          onClick={onChangeFacet(1)}>
          <HiOutlineChevronRight />
        </button>
      </div>

      {search.result?.aggregations &&
        <div className="p6o-aggs-container">
          <ul>
            {search.result.aggregations[activeAggregation].buckets.map(({ label, count }) => (
                <li 
                  key={label} 
                  className={filterValues.length > 0 && !filterValues.includes(label) ? 'p6o-value-unselected' : ''}
                  onClick={onToggleValue(label)}>
                  <div className="p6o-agg-value-wrapper">
                    <span 
                      className="p6o-agg-value-count"
                      style={{ 
                        backgroundColor: props.colors && props.colors[label],
                        borderColor: props.colors && props.colors[label ] && chroma(props.colors[label]).alpha(0.8).hex()
                      }}>

                      {formatNumber(count)}
                    </span>

                    <span className="p6o-agg-value-label">{label}</span>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      }
    </div>
  )

}
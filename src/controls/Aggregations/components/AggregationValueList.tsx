import React from 'react';
import chroma from 'chroma-js';

const formatNumber = (num: number) => {
  if (num > 1000)
    return (num / 1000).toFixed(1) + 'k';
  else if (num > 1000000)
    return (num / 1000000).toFixed(1) + 'M';
  else 
    return num;
}

type AggregationValueListProps = {

  buckets: { label: string, count: number }[]

  colors: { [ key: string ]: string }

  filterValues: string[]

  onToggleFilterValue: Function

}

export const AggregationValueList = (props: AggregationValueListProps) => {

  return (
    <div className="p6o-aggs-values">
      <ul>
        {props.buckets.map(({ label, count }) => (
          <li 
            key={label} 
            className={props.filterValues.length > 0 && !props.filterValues.includes(label) ? 'p6o-value-unselected' : ''}
            onClick={props.onToggleFilterValue(label)}>
            
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
        ))}
      </ul>
    </div>
  )

}
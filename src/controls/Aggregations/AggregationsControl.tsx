import React from 'react';
import { 
  HiOutlineChevronLeft, 
  HiOutlineChevronRight 
} from 'react-icons/hi';
import { useSearch } from '../../store';

const formatNumber = (num: number) => {
  if (num > 1000)
    return (num / 1000).toFixed(1) + 'k';
  else if (num > 1000000)
    return (num / 1000000).toFixed(1) + 'M';
  else 
    return num;
}

export const AggregationsControl = () => {

  const { search, setActiveAggregation } = useSearch();

  if (!search.result?.aggregations || !search.args.activeAggregation)
    return null;
  
  const aggregations =
    Object.keys(search.result.aggregations);
  
  const onChangeFacet = (inc: number) => () => {
    const { length } = aggregations;
    const currentIdx = aggregations.indexOf(search.args.activeAggregation as string);
    const updatedIdx = (currentIdx + inc + length) % length;
    setActiveAggregation(aggregations[updatedIdx]);
  }

  return (
    <div className="p6o-facets">
      <div className="p6o-facets-carousel">
        <button 
          tabIndex={4}
          aria-label="Previous filter category"
          onClick={onChangeFacet(-1)}>
          <HiOutlineChevronLeft />
        </button>
          
        <h3 
          aria-live="polite"
          aria-atomic={true}>
          {search.args.activeAggregation}
        </h3>
        
        <button
          tabIndex={5}
          aria-label="Next filter category"
          onClick={onChangeFacet(1)}>
          <HiOutlineChevronRight />
        </button>
      </div>

      <div className="p6o-facets-container">
        <ul>
          {search.result.aggregations[search.args.activeAggregation].buckets.map(({ label, count}) => (
              <li key={label}>
                <div className="p6o-facet-value-wrapper">
                  <span className="p6o-facet-value-count">{formatNumber(count)}</span>
                  <span className="p6o-facet-value-label">{label}</span>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )

}
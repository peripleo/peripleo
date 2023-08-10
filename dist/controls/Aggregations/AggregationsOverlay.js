import React from 'react';
import { useSearch } from '../../store';
import { AggregationsCarousel, AggregationValueList } from './components';
import './AggregationsOverlay.css';
export const AggregationsOverlay = (props) => {
    const { search, setFilter, setActiveAggregation } = useSearch();
    const aggregations = search.result?.aggregations ?
        Object.keys(search.result.aggregations) : [];
    const displayed = props.displayFacets || aggregations;
    const activeAggregation = search.args.activeAggregation || displayed[0] || '';
    const filterValues = search.args.filters?.find(f => f.name === activeAggregation)?.values || [];
    const onToggleFilterValue = (value) => () => {
        const updated = filterValues.includes(value) ?
            { name: activeAggregation, values: filterValues.filter(str => str !== value) } :
            { name: activeAggregation, values: [...filterValues, value] };
        setFilter(updated);
    };
    return (React.createElement("div", { className: props.fullscreen ? "p6o-aggs p6o-aggs-overlay fullscreen" : "p6o-aggs p6o-aggs-overlay" },
        React.createElement(AggregationsCarousel, { aggregations: displayed, labels: props.facetLabels, activeAggregation: activeAggregation, onChangeAggregation: setActiveAggregation }),
        search.result?.aggregations &&
            React.createElement(AggregationValueList, { buckets: search.result.aggregations[activeAggregation].buckets, colors: props.colors, filterValues: filterValues, onToggleFilterValue: onToggleFilterValue })));
};
//# sourceMappingURL=AggregationsOverlay.js.map
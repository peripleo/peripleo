import React from 'react';
import chroma from 'chroma-js';
const formatNumber = (num) => {
    if (num > 1000)
        return (num / 1000).toFixed(1) + 'k';
    else if (num > 1000000)
        return (num / 1000000).toFixed(1) + 'M';
    else
        return num;
};
export const AggregationValueList = (props) => {
    return (React.createElement("div", { className: "p6o-aggs-values" },
        React.createElement("ul", null, props.buckets.map(({ label, count }) => (React.createElement("li", { key: label, className: props.filterValues.length > 0 && !props.filterValues.includes(label) ? 'p6o-value-unselected' : '', onClick: props.onToggleFilterValue(label) },
            React.createElement("div", { className: "p6o-agg-value-wrapper" },
                React.createElement("span", { className: "p6o-agg-value-count", style: {
                        backgroundColor: props.colors && props.colors[label],
                        borderColor: props.colors && props.colors[label] && chroma(props.colors[label]).alpha(0.8).hex()
                    } }, formatNumber(count)),
                React.createElement("span", { className: "p6o-agg-value-label" }, label))))))));
};
//# sourceMappingURL=AggregationValueList.js.map
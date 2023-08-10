import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
export const AggregationsCarousel = (props) => {
    const activeAggregation = props.activeAggregation || props.aggregations[0] || '';
    const label = props.labels ?
        props.labels[props.aggregations.indexOf(activeAggregation)] : activeAggregation;
    const onChangeAggregation = (inc) => () => {
        const { length } = props.aggregations;
        const currentIdx = props.aggregations.indexOf(activeAggregation);
        const updatedIdx = (currentIdx + inc + length) % length;
        props.onChangeAggregation(props.aggregations[updatedIdx]);
    };
    return (React.createElement("div", { className: "p6o-aggs-carousel" },
        React.createElement("button", { tabIndex: 4, "aria-label": "Previous filter category", onClick: onChangeAggregation(-1) },
            React.createElement(HiOutlineChevronLeft, null)),
        React.createElement("h3", { "aria-live": "polite", "aria-atomic": true }, label),
        React.createElement("button", { tabIndex: 5, "aria-label": "Next filter category", onClick: onChangeAggregation(1) },
            React.createElement(HiOutlineChevronRight, null))));
};
//# sourceMappingURL=AggregationsCarousel.js.map
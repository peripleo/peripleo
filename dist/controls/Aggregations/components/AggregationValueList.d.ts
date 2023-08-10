/// <reference types="react" />
declare type AggregationValueListProps = {
    buckets: {
        label: string;
        count: number;
    }[];
    colors: {
        [key: string]: string;
    };
    filterValues: string[];
    onToggleFilterValue: Function;
};
export declare const AggregationValueList: (props: AggregationValueListProps) => JSX.Element;
export {};
//# sourceMappingURL=AggregationValueList.d.ts.map
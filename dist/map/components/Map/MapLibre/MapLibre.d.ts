import React from 'react';
import '../Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';
declare type MapLibreProps = {
    children: React.ReactElement;
    mapStyle: string;
    defaultBounds: [[number, number], [number, number]];
    tooltip: Function;
    popup: Function;
};
export declare const MapLibre: (props: MapLibreProps) => JSX.Element;
export {};
//# sourceMappingURL=MapLibre.d.ts.map
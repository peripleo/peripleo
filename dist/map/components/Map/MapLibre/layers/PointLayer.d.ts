/// <reference types="react" />
import { Geometry, GeoJsonProperties, FeatureCollection } from 'geojson';
declare type PointLayerProps = {
    id: string;
    color: string;
    sizes: number[];
    data: FeatureCollection<Geometry, GeoJsonProperties> | undefined;
};
export declare const PointLayer: (props: PointLayerProps) => JSX.Element;
export {};
//# sourceMappingURL=PointLayer.d.ts.map
/// <reference types="react" />
import { DeckGLLayer, ViewState } from '../../../types';
import '../Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';
declare type DeckGLMapProps = {
    mapStyle: string;
    initialViewState: ViewState;
    onViewStateChange: Function;
    layers?: DeckGLLayer[];
    tooltip: Function;
    popup: Function;
    onClick: Function;
};
export declare const DeckGLMap: (props: DeckGLMapProps) => JSX.Element;
export {};
//# sourceMappingURL=DeckGLMap.d.ts.map
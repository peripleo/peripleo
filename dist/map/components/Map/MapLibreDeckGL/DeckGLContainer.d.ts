/// <reference types="react" />
import { DeckGLLayer } from '../../../types';
declare type DeckGLContainerProps = {
    mapStyle: string;
    defaultBounds: [[number, number], [number, number]];
    layers?: DeckGLLayer[];
    tooltip: Function;
    popup: Function;
    onClick: Function;
};
export declare const DeckGLContainer: (props: DeckGLContainerProps) => JSX.Element;
export {};
//# sourceMappingURL=DeckGLContainer.d.ts.map
/// <reference types="react" />
export declare const Map: {
    MapLibre: (props: {
        children: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>;
        mapStyle: string;
        defaultBounds: [[number, number], [number, number]];
        tooltip: Function;
        popup: Function;
    }) => JSX.Element;
    MapLibreDeckGL: (props: {
        mapStyle: string;
        defaultBounds: [[number, number], [number, number]];
        layers?: import("../..").DeckGLLayer[];
        tooltip: Function;
        popup: Function;
        onClick: Function;
    }) => JSX.Element;
};
export * from './MapLibre/layers';
//# sourceMappingURL=index.d.ts.map
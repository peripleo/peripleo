import React, { useCallback, useMemo, useRef } from 'react';
import ReactMapGL from 'react-map-gl';
import DeckGL from '@deck.gl/react/typed';
import { useSearch, useGraph } from '../../../../store';
import '../Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';
export const DeckGLMap = (props) => {
    const deckRef = useRef(null);
    const { search } = useSearch();
    const graph = useGraph();
    const data = useMemo(() => search?.result && search.status === 'OK' && search.result.items.length > 0 ?
        search.result.items : null, [search]);
    const layers = useMemo(() => props.layers && data ? props.layers.reduce((all, next) => {
        const l = next(data, graph);
        return Array.isArray(l) ?
            [...all, ...l] : [...all, l];
    }, []) : [], [data, props.layers]);
    const onClick = useCallback((event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        const pickInfo = deckRef.current.pickObject({
            x: offsetX,
            y: offsetY,
            radius: 3
        });
        if (pickInfo && props.onClick)
            props.onClick(pickInfo);
    }, [props.onClick, deckRef]);
    return (React.createElement("div", { onClick: onClick },
        React.createElement(DeckGL, { ref: deckRef, initialViewState: props.initialViewState, controller: true, 
            // @ts-ignore
            onViewStateChange: props.onViewStateChange, layers: layers, getTooltip: props.tooltip ? (feature) => props.tooltip({ ...feature, graph, search }) : null },
            React.createElement(ReactMapGL, { mapStyle: props.mapStyle }))));
};
//# sourceMappingURL=DeckGLMap.js.map
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMapGL from 'react-map-gl';
import { useRecoilState } from 'recoil';
import { mapViewState, isValidViewState, selectedState } from '../../../state';
import { useDeviceState } from '../../../../device';
import { useGraph, useSearch } from '../../../../store';
import { PopupContainer, TooltipContainer } from '../..';
import { getDefaultViewState } from '../initialState';
import '../Map.css';
import 'maplibre-gl/dist/maplibre-gl.css';
export const MapLibre = (props) => {
    const ref = useRef(null);
    const mapRef = useRef(null);
    const device = useDeviceState();
    const [viewState, setViewState] = useRecoilState(mapViewState);
    const [selected, setSelected] = useRecoilState(selectedState);
    const { search } = useSearch();
    const graph = useGraph();
    const [hover, setHover] = useState();
    // Set initial view state on first render
    useEffect(() => {
        if (ref.current && !isValidViewState(viewState)) {
            const defaultState = getDefaultViewState(props.defaultBounds, ref.current);
            setViewState(defaultState);
        }
    }, [ref.current]);
    const data = useMemo(() => search?.status === 'OK' && search.result?.items.length ? {
        type: 'FeatureCollection',
        features: search.result.items.map(f => ({ ...f, properties: { id: f.id, ...f.properties } }))
    } : null, [search]);
    const layerIds = useMemo(() => React.Children.map(props.children, c => c.props.id) || [], [props.children]);
    const getNodeAt = useCallback((point) => {
        if (!mapRef.current)
            return;
        const features = mapRef.current
            .queryRenderedFeatures(point)
            .filter(l => layerIds.find(id => l.layer.id.startsWith(id)));
        if (features.length > 0) {
            const feature = features[0];
            const node = graph.getNodeById(feature.properties?.id);
            return { node, feature };
        }
    }, [props.children, graph, mapRef.current, layerIds]);
    const onMouseMove = useCallback((evt) => {
        const { point } = evt;
        const n = getNodeAt(point);
        if (n) {
            const { node, feature } = n;
            const updated = hover && (node?.id === hover?.node.id) ? {
                ...hover, ...point // just update mouse position
            } : {
                node,
                feature,
                ...point
            };
            ref.current?.classList.add('hover');
            setHover(updated);
        }
        else {
            ref.current?.classList.remove('hover');
            setHover(undefined);
        }
    }, [getNodeAt, hover]);
    const onClick = (evt) => {
        const n = getNodeAt(evt.point);
        if (n) {
            const clone = JSON.parse(JSON.stringify(n));
            setHover(null);
            setSelected(clone);
        }
        else {
            setSelected(null);
        }
    };
    return (React.createElement("div", { ref: ref, className: 'p6o-map-container' },
        isValidViewState(viewState) &&
            React.createElement(ReactMapGL, { clickTolerance: device.isTouchDevice ? 10 : 3, ref: mapRef, initialViewState: viewState, mapStyle: props.mapStyle, onClick: onClick, onMouseMove: onMouseMove, onMove: evt => setViewState(evt.viewState) }, React.Children.map(props.children, c => React.cloneElement(c, { data }))),
        props.tooltip && hover &&
            React.createElement(TooltipContainer, { ...hover, tooltip: props.tooltip }),
        props.popup && mapRef.current && selected &&
            React.createElement(PopupContainer, { selected: selected, viewState: viewState, map: mapRef.current, popup: props.popup, onClose: () => setSelected(null) })));
};
//# sourceMappingURL=MapLibre.js.map
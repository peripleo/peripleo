import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { MapGeoJSONFeature, Map as MapLibre, MapMouseEvent, PointLike, StyleSpecification } from 'maplibre-gl';
import { MapProps } from './MapProps';
import { PopupContainer } from '../components/Popup';
import { Feature } from '../../model';
import { MapContext, useSelectionState, useHoverState } from '../../state';
import { useFeatureRadioState } from './useFeatureRadioState';
import { findMapFeature, listFeaturesInCluster } from './utils';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 3;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const context = useContext(MapContext);

  const map = context.map as MapLibre;

  const { setMap } = context;

  const baselayers = useRef<Set<string>>(new Set());

  // Hover state according to mouse move events
  const [mapHover, setMapHover] = useFeatureRadioState('hover');

  // Global Peripleo state (which can be changed programmatically from outside)
  const {hover, setHover} = useHoverState();

  // Map selection state
  const [mapSelection, setMapSelection] = useFeatureRadioState('selected');

  // Global Peripleo state (which can be changed programmatically from outside)
  const {selected, setSelected} = useSelectionState();

  const isExternalChange = useRef<boolean>(true);

  const getFeature = (
    evt: MapMouseEvent, withBuffer?: boolean
  ) => {
    const map = evt.target;

    const query = withBuffer ? [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ] as [PointLike, PointLike]: evt.point;

    const features = map.queryRenderedFeatures(query)
      .filter(feature => 'interactive' in (feature.layer.metadata as object || {}));

    if (features.length > 0)
      return features[0];
  }

  const onMouseMove = (evt: MapMouseEvent) => {
    const feature = getFeature(evt);
    isExternalChange.current = false;
    setMapHover(evt.target, feature);
  }

  const onClick = (evt: MapMouseEvent) => {
    const feature = getFeature(evt, true);
    isExternalChange.current = false;
    setMapSelection(evt.target, feature, feature?.source);
  }

  // Gets the domain-model Feature for the given MapGeoJSONFeature
  const resolveModelFeature = (
    map: MapLibre, 
    feature: MapGeoJSONFeature
  ): Promise<Feature> => new Promise(resolve => {
    if (!feature) {
      resolve(undefined);
    } else if (feature.properties.cluster) {
      listFeaturesInCluster(map, feature)
        .then(resolvedFeatures => resolve(resolvedFeatures.length > 0 ? resolvedFeatures[0] : undefined))
        .catch(() => {
          // Can happens if the cluster no longer exists at the time this method gets called.
          // Frequently the case during zooming.
        });
    } else {
      const { id, type, properties, geometry } = feature;
      resolve({ id, type, properties, geometry } as Feature);
    }
  });

  useLayoutEffect(() => {
    if (!isExternalChange.current) // sync hover state upwards
      resolveModelFeature(map, mapHover?.feature).then(setHover); 
  }, [map, mapHover]);

  useLayoutEffect(() => {
    if (!map)
      return; 

    if (isExternalChange.current) { // sync external update downwards
      if (hover)
        findMapFeature(map, hover.id).then(f => setMapHover(map, f));
      else
        setMapHover(map, undefined);
    }
    
    isExternalChange.current = true;
  }, [map, hover]);

  useLayoutEffect(() => {
    if (!isExternalChange.current) // sync selection state upwards
      resolveModelFeature(map, mapSelection?.feature).then(setSelected);
  }, [map, mapSelection]);

  useLayoutEffect(() => {
    if (!map)
      return; 

    if (isExternalChange.current) { // sync external update downwards
      if (selected)
        findMapFeature(map, selected.id).then(f => setMapSelection(map, f));
      else
        setMapSelection(map, undefined);
    }

    isExternalChange.current = true;
  }, [map, selected]);

  const trackBaselayers = (map: MapLibre) => {
    const { layers } = map.getStyle() || {};
    if (!layers) {
      console.warn('No base layers loaded');
    } else {
      const ids = layers.map(l => l.id);
      baselayers.current = new Set(ids);
    }
  }

  useEffect(() => {
    const map = new MapLibre({
      container: ref.current,
      style: props.style,
      bounds: props.defaultBounds,
      hash: 'map'
    });

    map.once('styledata', () => trackBaselayers(map));

    map.on('click', onClick);
    map.on('mousemove', onMouseMove);

    if (props.disableScrollZoom)
      map.scrollZoom.disable();

    setMap(map);

    return () => {
      map.off('click', onClick);
      map.off('mousemove', onMouseMove);
    }
  }, []);

  useEffect(() => {
    const style = map?.getStyle();
    if (!style) return;

    const updateBaselayers = (next: StyleSpecification) => {
      // Retain all current layers that are *not* tracked as baselayers
      const retainedLayers = style.layers
        .filter(l => !baselayers.current.has(l.id));

      const retainedLayerIds = 
        new Set(retainedLayers.map(l => l.id));

      // Retain all current sources *not* referenced by base layers
      const retainedSourceIds = new Set(
        retainedLayers
          .map(l => 'source' in l && l.source)
          .filter(Boolean));

      const retainedSources = Object.entries(style.sources)
        .filter(([id, _]) => retainedSourceIds.has(id));

      // Updated style
      const updated = {
        ...style, // Current style
        layers: [
          // Next base layer
          ...next.layers,
          // Current layers to retain
          ...style.layers.filter(l => retainedLayerIds.has(l.id))
        ],
        sources: Object.fromEntries([
          // Next base layer sources
          ...Object.entries(next.sources),
          // Current sources to retain
          ...retainedSources
        ])
      } as StyleSpecification;

      // Track next style's layers as new base layers
      baselayers.current = new Set(next.layers.map(l => l.id));
      map.setStyle(updated);
    }

    if (typeof props.style === 'string') {
      // Remote style spec
      fetch(props.style)
        .then(res => res.json())
        .then(data => updateBaselayers(data as StyleSpecification));
    } else {
      // JSON style spec
      updateBaselayers(props.style);
    }
  }, [props.style]);

  return (
    <div 
      ref={ref}
      className={props.className ? `${props.className} p6o-map-container`: 'p6o-map-container'}>
      {map && (
        <>
          {props.children}

          {props.popup && (
            <PopupContainer 
              map={map}
              selected={selected}
              popup={props.popup} 
              onClose={() => setSelected(undefined)} />
          )}
        </>
      )}
    </div>
  )

}
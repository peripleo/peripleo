import { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { Feature, MapContext, useSelectionState } from '@peripleo/peripleo'; 
import { MapGeoJSONFeature, Map as MapLibre, MapMouseEvent, PointLike, StyleSpecification } from 'maplibre-gl';
import { MapProps } from './MapProps';
import { PopupContainer } from '../components/Popup';
import { useHoverState } from '../hooks';
import { useFeatureRadioState } from './useFeatureRadioState';
import { findMapFeature, listFeaturesInCluster } from './utils';

import 'maplibre-gl/dist/maplibre-gl.css';

export const CLICK_THRESHOLD = 3;

export const Map = (props: MapProps) => {

  const ref = useRef<HTMLDivElement>(null);

  const context = useContext(MapContext);

  const map = context.map as MapLibre;

  const { setMap, setLoaded } = context;

  const baselayers = useRef<Set<string>>(new Set());

  // Hover state according to mouse move events
  const [mapHover, setMapHover] = useFeatureRadioState('hover');

  // Global Peripleo state (which can be changed programmatically from outside)
  const {hover, setHover} = useHoverState();

  // Map selection state
  const [mapSelection, setMapSelection] = useFeatureRadioState('selected');

  // Global Peripleo state (which can be changed programmatically from outside)
  const {selection, setSelection} = useSelectionState();

  const isExternalHoverChange = useRef<boolean>(true);

  const isExternalSelectionChange = useRef<boolean>(true);

  const getFeature = (
    evt: MapMouseEvent, withBuffer?: boolean
  ) => {
    if (!evt.point) return;

    const map = evt.target;

    const query = withBuffer ? [
      [evt.point.x - CLICK_THRESHOLD, evt.point.y - CLICK_THRESHOLD],
      [evt.point.x + CLICK_THRESHOLD, evt.point.y + CLICK_THRESHOLD]
    ] as [PointLike, PointLike]: evt.point;

    const features = map.queryRenderedFeatures(query)
      .filter(feature => (feature.layer.metadata as any || {}).interactive);

    if (features.length > 0)
      return features[0];
  }

  const onMouseMove = (evt: MapMouseEvent) => {
    const feature = getFeature(evt);
    isExternalHoverChange.current = false;
    setMapHover(evt.target, evt, feature);
  }

  const onMouseOut = (evt: MapMouseEvent) => {
    isExternalHoverChange.current = false;
    setMapHover(evt.target, evt, undefined);
  }

  const onClick = (evt: MapMouseEvent) => {
    const feature = getFeature(evt, true);
    isExternalSelectionChange.current = false;
    setMapSelection(evt.target, evt, feature, feature?.source);
  }

  // Gets the domain-model Feature for the given MapGeoJSONFeature
  const resolveModelFeature = (
    map: MapLibre, 
    feature: MapGeoJSONFeature
  ) => new Promise<{ mapFeature: MapGeoJSONFeature, resolved: Feature | Feature[] | undefined }>(resolve => {
    if (!feature) {
      resolve(undefined);
    } else if (feature.properties.cluster) {
      listFeaturesInCluster(map, feature)
        .then(resolvedFeatures => resolve({
          mapFeature: feature,
          resolved: 
            resolvedFeatures.length === 1 ? resolvedFeatures[0] : 
            resolvedFeatures.length > 1 ? resolvedFeatures : undefined
        }))
        .catch(() => {
          // Can happens if the cluster no longer exists at the time this method gets called.
          // Frequently the case during zooming.
        });
    } else {
      const { id, type, properties, geometry } = feature;
      resolve({
        mapFeature: feature,
        resolved: { id, type, properties, geometry } as Feature
      });
    }
  });

  useLayoutEffect(() => {
    if (!isExternalHoverChange.current) {
      // sync hover state upwards
      resolveModelFeature(map, mapHover?.feature)
        .then(r => {
          if (r) {
            setHover({ 
              mapFeature: r.mapFeature, 
              hovered: r.resolved, 
              mapEvent: mapHover.event 
            });
          } else { 
            setHover(undefined);
          }
          // isExternalHoverChange.current = true;
        });
    }
  }, [map, mapHover]);

  useLayoutEffect(() => {
    if (!map) return;

    if (isExternalHoverChange.current) { // sync external hover update downwards
      if (hover) {
        const first = Array.isArray(hover.hovered) ? hover.hovered[0] : hover.hovered;
        if (first)
          findMapFeature(map, first.id).then(f => setMapHover(map, undefined, f));
      } else {
        setMapHover(map);
      }
    }

    isExternalHoverChange.current = true;
  }, [map, hover]);

  useLayoutEffect(() => {
    if (!isExternalSelectionChange.current) // sync selection state upwards
      resolveModelFeature(map, mapSelection?.feature)
        .then(r => r ? setSelection({ 
          mapFeature: r.mapFeature, 
          selected: r.resolved,
          mapEvent: mapSelection.event
        }) : setSelection(undefined)); 
  }, [map, mapSelection]);

  useLayoutEffect(() => {
    if (!map) return; 

    if (isExternalSelectionChange.current) { // sync external update downwards
      if (selection) {
        // We don't support multi-selection downwards!
        const first = Array.isArray(selection.selected) ? selection.selected[0] : selection.selected;
        if (first)
          findMapFeature(map, first.id).then(f => setMapSelection(map, undefined, f));
      } else {
        setMapSelection(map, undefined);
      }
    }

    isExternalSelectionChange.current = true;
  }, [map, selection]);

  const trackBaselayers = (map: MapLibre) => {
    const { layers } = map.getStyle() || {};
    if (layers) {
      const ids = layers.map(l => l.id);
      baselayers.current = new Set(ids);
    }
  }

  useEffect(() => {
    const { 
      bounds,
      children,
      className,
      defaultBounds,
      disableScrollZoom,
      lang,
      popup,
      ...maplibreOpts
    } = props;

    const next = new MapLibre({
      ...maplibreOpts,
      container: ref.current,
      bounds: defaultBounds,
      hash: maplibreOpts.hash || 'map'
    });

    setMap(next);

    // Allow empty map
    if (!props.style) setLoaded(true);

    next.once('load', () => setLoaded(true));
    next.once('styledata', () => trackBaselayers(next));

    next.on('click', onClick);
    next.on('mousemove', onMouseMove);
    next.on('mouseout', onMouseOut);
    next.on('mouseleave', onMouseOut);

    // If the map viewport changes, re-evaluate the mouse hover
    next.on('move', onMouseMove);
    next.on('zoom', onMouseMove);
    next.on('rotate', onMouseMove);
    next.on('pitch', onMouseMove);

    if (disableScrollZoom)
      next.scrollZoom.disable();

    return () => {
      setMap(undefined);

      next.off('click', onClick);
      next.off('mousemove', onMouseMove);
      next.off('mouseout', onMouseOut);
      next.off('mouseleave', onMouseOut);

      next.off('move', onMouseMove);
      next.off('zoom', onMouseMove);
      next.off('rotate', onMouseMove);
      next.off('pitch', onMouseMove);

      // This is mostly for React strict mode, during dev. If the 
      // map unmounts instantly again, before it is even loaded,
      // mapLibre will raise an exception because of a broken
      // HTTP request (for the style). This logic defers removal
      // until after the request completes, if necessary.
      if (next.loaded() || !next.style)
        next.remove();
      else
        next.on('load', () => next.remove())
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

  useEffect(() => {
    if (!props.lang || !map?.style) return;

    const setLanguage = () =>
      map.getStyle().layers.forEach(layer => {
        if (layer.layout && layer.layout['text-field'])
          map.setLayoutProperty(layer.id, 'text-field', ['get', `name:${props.lang}`]);
      });

    if (map.getStyle()?.layers) {
      setLanguage();
    } else {
      map.once('styledata', setLanguage);
    }
  }, [map, props.lang])

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
              selected={mapSelection?.feature}
              popup={props.popup} 
              onClose={() => setSelection(undefined)} />
          )}
        </>
      )}
    </div>
  )

}
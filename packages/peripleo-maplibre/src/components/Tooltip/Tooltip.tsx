import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GeoJSONSource,  MapMouseEvent } from 'maplibre-gl';
import { useMap } from '../../map';
import { Feature, FeatureCluster } from '../../../../peripleo/src/model';

interface TooltipProps {

  layerId: string | string[];

  content(target: Feature | FeatureCluster, event: MouseEvent): ReactNode;

}

interface Hovered { 
  
  target: Feature | FeatureCluster;
  
  event: MouseEvent; 
  
}

const DEFAULT_OFFSET = 10;

export const Tooltip = (props: TooltipProps) => {

  const map = useMap();

  const layerIds = new Set(Array.isArray(props.layerId) ? props.layerId : [props.layerId]);

  const el = useRef<HTMLDivElement>(null);
  
  const [hovered, setHovered] = useState<Hovered | undefined>();

  const onMouseMove = (event: MapMouseEvent) => {
    const map = event.target;

    const features = map.queryRenderedFeatures(event.point)
      .filter(({ layer }) => layerIds.has(layer.id));

    if (features.length > 0) {
      const { id, type, source, properties, geometry } = features[0];

      if (properties.cluster) {
        // This feature is a cluster
        const clusterSource = map.getSource(source) as GeoJSONSource;
        clusterSource.getClusterLeaves(properties.cluster_id, Infinity, 0, (error, results) => {
          if (error) {
            // Usually happens if the cluster no longer exists at the time this method gets called.
            // Frequently the case while hovering during a zoom action.
            // console.warn(error);
          } else {
            const clusteredFeatures = results.map(r => ({ 
              type: r.type, 
              properties: r.properties, 
              geometry: r.geometry 
            }) as Feature);

            setHovered({
              target: { clusterId: id as number, features: clusteredFeatures }, 
              event: event.originalEvent
            });
          }
        });
      } else {
        setHovered({ 
          target: { type, properties, geometry } as Feature, 
          event: event.originalEvent
        });
      }
    } else {
      setHovered(undefined);
    }
  }

  useLayoutEffect(() => {
    if (el.current) {
      const { clientX, clientY } = hovered.event;

      const style = el.current.style;
      style.left = `${clientX + DEFAULT_OFFSET}px`;
      style.top = `${clientY + DEFAULT_OFFSET}px`;
    }
  }, [hovered]);

  useEffect(() => {
    map.on('mousemove', onMouseMove);

    return () => {
      map.off('mousemove', onMouseMove);
    }
  }, [map]);

  return hovered && createPortal(
    <div
      ref={el}
      className="p6o-tooltip-container">
      {props.content(hovered.target, hovered.event)}
    </div>,

    document.body
  )

}
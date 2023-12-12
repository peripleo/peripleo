import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MapGeoJSONFeature, MapMouseEvent, PointLike } from 'maplibre-gl';
import { CLICK_THRESHOLD, useMap } from '../../map';

interface TooltipProps {

  layerId: string;

  content(feature: MapGeoJSONFeature): ReactNode;

}

interface Hovered { 
  
  event: MapMouseEvent; 
  
  feature: MapGeoJSONFeature;

}

const DEFAULT_OFFSET = 10;

export const Tooltip = (props: TooltipProps) => {

  const map = useMap();

  const el = useRef<HTMLDivElement>(null);
  
  const [hovered, setHovered] = useState<Hovered | undefined>();

  const onMouseMove = (event: MapMouseEvent) => {
    const map = event.target;

    const bbox: [PointLike, PointLike] = [
      [event.point.x - CLICK_THRESHOLD, event.point.y - CLICK_THRESHOLD],
      [event.point.x + CLICK_THRESHOLD, event.point.y + CLICK_THRESHOLD]
    ];

    const features = map.queryRenderedFeatures(bbox)
      .filter(({ layer }) => layer.id === props.layerId);

    if (features.length > 0)
      setHovered({ feature: features[0], event });
    else
      setHovered(undefined);
  }

  useLayoutEffect(() => {
    if (el.current) {
      const { clientX, clientY } = hovered.event.originalEvent;

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
      {props.content(hovered.feature)}
    </div>,

    document.body
  )

}
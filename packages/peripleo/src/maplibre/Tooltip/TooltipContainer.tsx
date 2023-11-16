import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { TooltipProps } from './TooltipProps';

interface TooltipContainerProps {

  event: MapMouseEvent;

  feature: MapGeoJSONFeature;

  tooltip(props: TooltipProps): ReactNode;

}

const OFFSET = [10, 10];

export const TooltipContainer = (props: TooltipContainerProps) => {

  const { event, feature, tooltip } = props;

  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (el.current) {
      const { clientX, clientY } = event.originalEvent;

      const style = el.current.style;
      style.left = `${clientX + OFFSET[0]}px`;
      style.top = `${clientY + OFFSET[1]}px`;
    }
  }, [event, feature]);

  return createPortal(
    <div
      ref={el}
      className="p6o-tooltip-container">
      {tooltip({ feature })}
    </div>,
    document.body
  )

}
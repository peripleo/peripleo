import { useMemo, useEffect } from 'react';
import { useMap } from '../../map';
import { nanoid } from 'nanoid'
import { PulsingMarker } from './PulsingMarker';

interface UsePulsingMarkerProps {

  size: number;

  rgb?: [number, number, number];

  duration?: number;

}

export const usePulsingMarker = (arg: number | UsePulsingMarkerProps) => {
  
  const map = useMap();

  const id = useMemo(() => `pulse-${nanoid()}`, []);

  const size = typeof arg === 'number' ? arg : arg.size;

  const rgb: [number, number, number] = typeof arg === 'number' 
    ? [246, 112, 86]
    : arg.rgb || [246, 112, 86];

  const duration = typeof arg === 'number' 
    ? 1000 
    : arg.duration || 1000;

  useEffect(() => {
    map.addImage(
      id, 
      PulsingMarker(size * 2, rgb, duration, map), 
      { pixelRatio: 2 });

    return () => {
      map.removeImage(id);
    }
  }, []);

  return {
    type: 'symbol',
    layout: {
      'icon-image': id
    }
  }

}
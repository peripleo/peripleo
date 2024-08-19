import type { ReactNode } from 'react';
import type { MapOptions } from 'maplibre-gl';
import type { PopupProps } from '../components';

export interface MapProps extends Omit<MapOptions, 'container'> {

  className?: string;

  lang?: string;

  style?: string | any; 
  
  defaultBounds?: [[number, number], [number, number]];

  children?: ReactNode;

  disableScrollZoom?: boolean;

  popup?(props: PopupProps): ReactNode;

}
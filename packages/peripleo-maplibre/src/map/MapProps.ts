import { ReactNode } from 'react';
import { AttributionControlOptions } from 'maplibre-gl';
import { PopupProps } from '../components';

export interface MapProps {

  attributionControl?: false | AttributionControlOptions;

  className?: string;

  style?: string | any; 
  
  defaultBounds?: [[number, number], [number, number]];

  children?: ReactNode;

  disableScrollZoom?: boolean;

  popup?(props: PopupProps): ReactNode;

}
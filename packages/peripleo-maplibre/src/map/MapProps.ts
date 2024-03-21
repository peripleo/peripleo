import { ReactNode } from 'react';
import { PopupProps } from '../components';

export interface MapProps {

  className?: string;

  style?: string | any; 
  
  defaultBounds?: [[number, number], [number, number]];

  children?: ReactNode;

  disableScrollZoom?: boolean;

  popup?(props: PopupProps): ReactNode;

}
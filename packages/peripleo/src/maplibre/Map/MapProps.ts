import { ReactNode } from 'react';
import { PopupProps } from '../Popup';

export interface MapProps {

  style: string; 
  
  defaultBounds?: [[number, number], [number, number]];

  children?: ReactNode;

  disableScrollZoom?: boolean;

  popup?(props: PopupProps): ReactNode;

}
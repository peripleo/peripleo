import { ReactNode } from 'react';
import { PopupProps } from '../components/Popup';

export interface MapProps {

  className?: string;

  style: string; 
  
  defaultBounds?: [[number, number], [number, number]];

  children?: ReactNode;

  disableScrollZoom?: boolean;

  popup?(props: PopupProps): ReactNode;

}
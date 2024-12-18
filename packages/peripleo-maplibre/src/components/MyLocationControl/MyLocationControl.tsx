import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useLoadedMap } from '../../hooks';

import './MyLocationControl.css';

type ExcludedProps = 'className' | 'onClick';

type MyLocationControlProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, ExcludedProps> & {

  children?: ReactNode;

  className?: string;

  enableHighAccuracy?: boolean;

  onBusy?(busy: boolean): void;

  onClick?(): void;

  onError?(): void;

  onSuccess?(): void;

}

export const MyLocationControl = (props: MyLocationControlProps) => {

  const map = useLoadedMap();

  const { children, className, enableHighAccuracy, onBusy, onClick, onError, onSuccess, ...rest } = props;

  const _onSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

    if (props.onSuccess) props.onSuccess();

    if (props.onBusy) props.onBusy(false);

    map?.easeTo({ center: [ longitude, latitude ], zoom: 12 });
  }

  const _onError = (error: GeolocationPositionError) => {
    console.warn('Error fetching location: ' + error.message);

    if (props.onError) props.onError();

    if (props.onBusy) props.onBusy(false);
  }

  const _onClick = () => {
    if (props.onClick) props.onClick();

    if (props.onBusy) props.onBusy(true);

    navigator.geolocation.getCurrentPosition(_onSuccess, _onError, {
      enableHighAccuracy: props.enableHighAccuracy === undefined ? true : props.enableHighAccuracy
    });
  }

  return (
    <button 
      {...rest}
      className={props.className ? `p6o-controls-btn p6o-my-location ${props.className}` : 'p6o-controls-btn p6o-my-location'}
      onClick={_onClick}>
      {props.children || 'My Location'}
    </button>
  )

}
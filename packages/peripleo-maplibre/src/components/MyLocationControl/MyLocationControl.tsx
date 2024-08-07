import { ReactNode } from 'react';
import { useLoadedMap } from '../../hooks';

import './MyLocationControl.css';

interface MyLocationControlProps {

  children?: ReactNode;

  enableHighAccuracy?: boolean;

  onBusy?(busy: boolean): void;

  onClick?(): void;

  onError?(): void;

  onSuccess?(): void;

}

export const MyLocationControl = (props: MyLocationControlProps) => {

  const map = useLoadedMap();

  const onSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

    if (props.onSuccess) props.onSuccess();

    if (props.onBusy) props.onBusy(false);

    map?.easeTo({ center: [ longitude, latitude ], zoom: 12 });
  }

  const onError = (error: GeolocationPositionError) => {
    console.warn('Error fetching location: ' + error.message);

    if (props.onError) props.onError();

    if (props.onBusy) props.onBusy(false);
  }

  const onClick = () => {
    if (props.onClick) props.onClick();

    if (props.onBusy) props.onBusy(true);

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: props.enableHighAccuracy === undefined ? true : props.enableHighAccuracy
    });
  }

  return (
    <button 
      className="p6o-controls-btn p6o-my-location"
      onClick={onClick}>
      {props.children || 'My Location'}
    </button>
  )

}
import { ReactNode } from 'react';
import { useLoadedMap } from '../../hooks';

import './MyLocationControl.css';

interface MyLocationControlProps {

  children?: ReactNode;

}

export const MyLocationControl = (props: MyLocationControlProps) => {

  const map = useLoadedMap();

  const onSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    map?.easeTo({ center: [ longitude, latitude ], zoom: 12 });
  }

  const onError = (error: GeolocationPositionError) =>
    console.warn('Error fetching location: ' + error.message);

  const onClick = () => 
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true
    });

  return (
    <button 
      className="p6o-controls-btn p6o-my-location"
      onClick={onClick}>
      {props.children || 'My Location'}
    </button>
  )

}
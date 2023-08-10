import React from 'react';
import { TbCurrentLocation } from 'react-icons/tb';
import { useMap, useViewState } from '../../map';
import './MyLocationControl.css';
export const MyLocationControl = () => {
    const map = useMap();
    const { setViewState } = useViewState();
    const onSuccess = (position) => {
        const { latitude, longitude } = position.coords;
        setViewState({ latitude, longitude, zoom: 12 });
        map?.easeTo({ center: [longitude, latitude], zoom: 12 });
    };
    const onError = (error) => console.warn('Error fetching location: ' + error.message);
    const onClick = () => navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true
    });
    return (React.createElement("button", { className: "p6o-controls-btn p6o-my-location", tabIndex: 40, "aria-label": "Go to my location", onClick: onClick },
        React.createElement(TbCurrentLocation, null)));
};
//# sourceMappingURL=MyLocationControl.js.map
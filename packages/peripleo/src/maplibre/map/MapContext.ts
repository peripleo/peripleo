import { createContext, useContext } from 'react';
import { Map } from 'maplibre-gl';

export const MapContext = createContext<Map>(null);

export const useMap = () => useContext(MapContext);
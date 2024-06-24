import { setRTLTextPlugin as _setRTLTextPlugin } from 'maplibre-gl';

// Expose this method to host applications
export const setRTLTextPlugin = (url: string, lazy: boolean) => _setRTLTextPlugin(url, lazy);

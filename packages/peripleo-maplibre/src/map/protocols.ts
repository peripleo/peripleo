import {
  addProtocol as _addProtocol,
  removeProtocol as _removeProtocol,
} from 'maplibre-gl';

// Allow hosts to register and remove protocols (e.g. pmtiles://)
export const addProtocol = (
  customProtocol: string,
  loadFn: Parameters<typeof _addProtocol>[1],
) => _addProtocol(customProtocol, loadFn);

export const removeProtocol = (customProtocol: string) =>
  _removeProtocol(customProtocol);

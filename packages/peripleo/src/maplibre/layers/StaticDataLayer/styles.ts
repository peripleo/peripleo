import chroma from 'chroma-js';

export interface PointStyle {

  radius?: number;

  color?: string;

}

export const pointStyle = (style: PointStyle) => ({
  'type': 'circle',
  'paint': {
    'circle-radius': style?.radius || 4,
    'circle-color': style?.color || '#fff',
    'circle-stroke-color': '#000',  
    'circle-stroke-width': 1
  }
});

export interface ShapeStyle {

  fill?: string;

  opacity?: number;

}

export const fillStyle = (style: ShapeStyle) => ({
  'type': 'fill',
  'paint': {
    'fill-color': style?.fill || '#ff623b',
    'fill-opacity': style?.opacity || 0.08
  }
});

export const strokeStyle = (style: ShapeStyle) => ({
  'type': 'line',
  'paint': {
    'line-color': style?.fill || '#ff623b',
    'line-opacity': 0.3
  }
});
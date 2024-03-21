export const DEFAULT_POINT_STYLE = {
  'type': 'circle',
  'paint': {
    'circle-radius': [
      'interpolate', 
      ['linear'],
      ['number', ['get','point_count'], 1 ],
      0, 4, 
      10, 14
    ],
    'circle-stroke-width': 1,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#3b62ff',
      '#ff623b'
    ],
    'circle-stroke-color': '#8d260c'
  }
};

export const DEFAULT_FILL_STYLE = {
  'type': 'fill',
  'paint': {
    'fill-color': '#ff623b',
    'fill-opacity': 0.2
  }
}

export const DEFAULT_STROKE_STYLE = {
  'type': 'line',
  'paint': {
    'line-color': '#ff623b',
    'line-opacity': 0.6
  }
}
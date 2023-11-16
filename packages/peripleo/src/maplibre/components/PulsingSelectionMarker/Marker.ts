import { Map } from 'maplibre-gl';

/**
 * Modified from the open example at
 * https://docs.mapbox.com/mapbox-gl-js/example/add-image-animated/
 */
export const Marker = (size: number, rgb: [number, number, number], duration: number, map: Map) => ({

  width: size,

  height: size,

  data: new Uint8Array(size * size * 4),
 
  // When the layer is added to the map,
  // get the rendering context for the map canvas.
  onAdd: function () {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d', { willReadFrequently: true });
  },
  
  render: function () {
    const t = (performance.now() % duration) / duration;
    
    const radius = (size / 2) * 0.2;
    const outerRadius = (size / 2) * 0.7 * t + radius;
    const context = this.context;
  
    // Draw the outer circle.
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    context.arc(
      this.width / 2,
      this.height / 2,
      outerRadius,
      0,
      Math.PI * 2
    );
    context.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${1.5 * (1 - t)})`;
    context.fill();

    // Update this image's data with data from the canvas.
    this.data = context.getImageData(
      0,
      0,
      this.width,
      this.height
    ).data;
  
    // Continuously repaint the map, resulting
    // in the smooth animation of the dot.
    map.triggerRepaint();
  
    // Return `true` to let the map know that the image was updated.
    return true;
  }
});

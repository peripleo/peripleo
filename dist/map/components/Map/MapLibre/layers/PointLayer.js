import React from 'react';
import { Source, Layer } from 'react-map-gl';
import chroma from 'chroma-js';
const pointStyle = ({ fill = '#fff', stroke = '#000', strokeWidth = 1, ramp = [0, 4, 18, 18] }) => ({
    'type': 'circle',
    'paint': {
        'circle-radius': [
            'interpolate',
            ['linear'],
            ['number', ['get', 'count'], 0],
            ...ramp
        ],
        'circle-color': fill,
        'circle-stroke-color': stroke,
        'circle-stroke-width': strokeWidth
    }
});
export const PointLayer = (props) => {
    const style = pointStyle({
        fill: props.color,
        stroke: chroma(props.color).darken().hex(),
        ramp: props.sizes
    });
    return (React.createElement(Source, { type: "geojson", data: props.data },
        React.createElement(Layer, { id: props.id, ...style })));
};
//# sourceMappingURL=PointLayer.js.map
# Peripleo

Peripleo is a React utility library that aims to simplify the development of map-based search and data visualization interfaces. Peripleo provides:

- an __architecture pattern__ and useful helpers to simplify application design
- a __library of React components__ useful when building map search interfaces

## Why not MapBox, MapLibre, etc.?

Peripleo is __not an alternative to existing map and geo-visualization libraries__ like [MapBox GL JS](https://www.mapbox.com/mapbox-gljs), [MapLibre](https://maplibre.org/) or [DeckGL](https://deck.gl/)! Instead it complements them with additional utilities and UI components. Think of Peripleo as an add-on toolbox that helps you keep your development [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) when you build your next map application.

## Key Concepts

[...]

## Peripleo Hello World

```jsx
<Peripleo>
  <BrowserStore 
    nodes={nodes}
    edges={edges}>

    <Map.MapLibre
      mapStyle="https://api.maptiler.com/maps/voyager/style.json?key={your-api-key}"
      defaultBounds={[[-15.764914, 33.847608], [35.240991, 58.156214]]}>

      <PointLayer 
        id="sample-point-layer"
        color="#9d00d1" 
        sizes={[
          1, 4,
          4, 18
        ]} />
    </Map.MapLibre>

    <Controls>
      <ZoomControl />
    </Controls>
  </BrowserStore>
</Peripleo>
```

## Components

[...]




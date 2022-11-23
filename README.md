# Peripleo

Peripleo is a React utility library that aims to simplify the development of map-based search and data visualization interfaces. 

> Peripleo is in an early stage & under active development. Some parts of it are incomplete (or maybe even broken) - but we are working on it ;-)

Peripleo provides:

- an __architecture pattern__ and some useful helpers to simplify application design
- a __library of React components__ useful when building map search interfaces

## Why not MapBox, MapLibre, etc.?

Peripleo is __not an alternative to existing map and geo-visualization libraries__ like [MapBox GL JS](https://www.mapbox.com/mapbox-gljs), [MapLibre](https://maplibre.org/) or [DeckGL](https://deck.gl/)! Instead it complements them with additional utilities and UI components. Think of Peripleo as an add-on toolbox that helps you keep your development [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) when you build your next map application.

## Key Concepts




[... Store -> Search -> Map ...]

### Application State

Peripleo provides helpers to manage global application state - map viewport, selected items, search arguments etc.
Every component inside the `<Peripleo>` component can access to global state through [hooks](https://reactjs.org/docs/hooks-intro.html). Internally, Peripleo uses [Recoil](https://recoiljs.org/) for state management.

### Nodes and Edges: the Store



### Search

### Maps

### Controls

[...]

## Peripleo Hello World

Below is a minimal example. It loads a static dataset into the built-in `BrowserStore`.  

```jsx
<Peripleo>
  <BrowserStore 
    nodes={nodes}
    edges={edges}
    index={['properties.title']}>

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
      <SearchBox />
      <ZoomControl />
    </Controls>
  </BrowserStore>
</Peripleo>
```

## Components

[...]

## Writing Custom Stores

[...]




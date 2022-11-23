# Peripleo

> __Important:__ Peripleo is currently in alpha state. Many parts are still incomplete and under active development.

Peripleo is a React utility library that aims to simplify the development of map-based search and data visualization interfaces. Peripleo provides:

- an __architecture pattern__ and some useful helpers to simplify map application development
- a __library of React components__ useful when building map search interfaces

![An example screenshot of a Peripleo map](peripleo.jpg)

__Important:__ Peripleo is __not an alternative to existing map and geo-visualization libraries__ like [MapBox GL JS](https://www.mapbox.com/mapbox-gljs), [MapLibre](https://maplibre.org/) or [DeckGL](https://deck.gl/)! On the contrary: it uses these libraries under the hood, and complements them with additional utilities and UI components.

Think of Peripleo as an add-on toolbox that helps you keep your development [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) when you build your next map application.

## Key Concepts

Applications built with Peripleo follow a specific design blueprint: 

- A __Store__ acts as the source of data. The store could be local, meaning that all data is loaded when the application starts. Or it could be an adapter to a remote database or API.
- The application has a global __Search State__, a set of query arguments and filters, usually defined by the user. The Search State defines which subset of data from the Store is currently visible in the UI.
- The __Search Adapter__ observes changes to the Search State, and retrieves new search results from the Store in response to the changes.
- The __Map__ visualizes the search results via different __Layers__.

Essentially, Peripleo provides a [Model-View-Presenter](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter) architecture for your map application: the __Store__ represents the model; the __Search Adapter__ acts as the presenter that translates the current search state into a formatted result; and the __Map__ is the view that visualizes the result on the screen. Within this architecture, Peripleo takes care of the plumbing between components, and provides interfaces for plugging in your own domain model.

## Hello World

Below is a minimal Peripleo application which:

- loads a list of two GeoJSON features into a `BrowserStore`
- enables text search on features' `properties.title` field
- instantiates a MapLibre map with default initial map bounds and a `PointLayer`
- adds a text search box and zoom buttons

```jsx
const features = [{
  "id": "http://sws.geonames.org/2772635",
  "type": "Feature",
  "properties": {
    "title": "Leonding"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [14.2533, 48.27965]
  }
}, {
  "id": "http://sws.geonames.org/2771706",
  "type": "Feature",
  "properties": {
    "title": "Meidling"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [16.33333, 48.16667]
  } 
}];

function App() {

  return (
    <Peripleo>
      <BrowserStore 
        nodes={features}
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
  )

}
```

## Responsive Design

Peripleo provides two helpers to simplify the development of responsive applications that work on different devices and screen sizes.

#### useDevice Hook

The `useDevice` hook is available to every component inside the `<Peripleo>` root tag. It returns the current device state: an object with a `size` string property (either __DESKTOP__ or __MOBILE__), and an `isTouchDevice` boolean property.

The size is determined by the screen width, and will update if the user resizes the screen. The default break point is 540 pixels, and can be changed through the `breakPoint` prop in the `<Peripleo>` component. 

#### Desktop and Mobile Tags

For convenience, Peripleo provides `<Desktop>` and `<Mobile>` tags. Components enclosed with a `<Desktop>` tag are only mounted if the device size is larger than the break point value. Vice versa, components inside `<Mobile>` are only mounted if the device size is lower than the break point value. 

## Components

### BrowserStore

The __BrowserStore__ implementats a simple local data store with standard features.

- Data is modeled as a __graph__. Nodes in the graph can be geographic features. In this case, they can be mapped directly. Or they don't have their own coordinates or geometry, but are linked to geographic feature through edges in the graph.
- For faster geographic queries ("show me everything in this area"), the BrowserStore includes a __spatial index__.
- The BrowserStore includes a local __fulltext index__ for text searches.

> You should view the BrowserStore mostly as a demo component. In practice, you will want to implement your own, custom store, which meets the needs of your application and models your domain more closely. However, it may be useful to adopt some of the BrowserStore's design principles and features.

### Map

The __Map__ component provides utility wrappers around different map libraries. Peripleo currently supports the following libraries:

- [MapLibre](https://maplibre.org/) (through [react-map-gl](https://visgl.github.io/react-map-gl/))
- [DeckGL](https://deck.gl/) (through MapLibre and react-map-gl)

### Controls

Peripleo provides a collection of UI controls for map search applications.

#### Aggregations

[...]

#### Info

An Info button which opens a configurable 'About' modal, centered above the map (work in progress).

#### Mobile Menu

A mobile 'Hamburger'-type menu button that opens a slide-in menu (work in progress).

#### MyLocation

A 'My Location' button that uses the HTML5 location API to zoom and center the map on the users current location.

#### SearchBox

A simple text search box.

#### Zoom

Zoom buttons.

## Writing Custom Stores

[...]




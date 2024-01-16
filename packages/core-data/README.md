# Core Data Client

The core data client provides runtime configuration options through a `config.json` file, located at the same path as the `index.html` host page.

Configuration covers the following aspects:

- Branding
- Map layers
- TypeSense server settings
- Core Data API path

```json
{
  "branding": {
    "title": "Core Data",
    "related": [
      { "endpoint": "media_contents", "ui_label": "Related Media & Documents", "default_open": false },
      { "endpoint": "organizations", "ui_label": "Organizations", "default_open": false },
      { "endpoint": "people", "ui_label": "Related People", "default_open": false },
      { "endpoint": "places", "ui_label": "Related Places", "default_open": false },
      { "endpoint": "taxonomies", "ui_label": "Taxonomies", "default_open": false }
    ]
  },
  "layers": [{ 
    "name": "Maptiler Basic V2",
    "type": "vector", 
    "url": "https://api.maptiler.com/maps/basic-v2-light/style.json?key=<your_api_key>"
  },{ 
    "name": "Stamen Watercolor",
    "type": "raster",
    "url": "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
    "minzoom": 0,
    "maxzoom": 22
  },{
    "name": "New Jersey Natural Earth (WMS)",
    "type": "raster",
    "url": "https://img.nj.gov/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=Natural2015",
    "overlay": true
  },{ 
    "name": "US States", 
    "type": "geojson", 
    "url": "gz_2010_us_040_00_20m.json", 
    "description": "Data from the United States Census Bureau. https://eric.clst.org/tech/usgeojson/",
    "overlay": true
  }],
  "typesense": {
    "host": "your_typescript_instance.typesense.net",
    "api_key": "your_typesense_api_key",
    "index_name": "your_index_name",
    "query_by": "title",
    "port": 443,
    "protocol": "https",
    "limit": 100
  },
  "core_data": {
    "url": "https://core-data-api.example.com",
    "project_ids": [1]
  }
}
```
### Branding

The `branding` block provides various configuration options to influence visual appearance. Branding settings are work in progress!

- `branding.title` - page title, displayed in the top-left of the header
- `branding.related` - the list of __Related__ (people, places, organizations, etc.) blocks, displayed in the detail view. The order in the config file 
  determines the order in the interface. Each item in the list is an object with the following properties:
  - `endpoint` - the path segment for this "related" category on the Core Data API, e.g. "media_contents", "people", etc.
  - `ui_label` - the label to use for this category in the interface
  - `default_open` - `true` if the accordion section for this category should be open by default

### Map Layers

Configure one or more map layers. Layers can be treated either as baselayers, or as additional overlay layers. At least one baselayer must be configured.

Each layer object can have the following properties:

- `name` - a name for the layer. __Required__. Must be unique.
- `type` - "raster", "vector" or "geojson". "geojson" can only be used as an overlay. __Required__.
- `url` - the URL to the source (vector tile manifest, raster map URL or XYZ template URL, GeoJSON file URL). __Required__.
- `overlay` - set to `true` to treat this layer as an overlay rather than a baselayer. Defaults to `false` (= baselayer).
- `attribution` - attribution text for this layer
- `minzoom` - minimum zoom level, defaults to 0
- `maxzoom` - maximum zoom level, defaults to 22

### TypeSense Server

The Core Data client uses the [TypeSense InstantSearch adapter](https://github.com/typesense/typesense-instantsearch-adapter). You need to provide the following
properties in the `typesense` block of the config file:

- `typesense.host` - URL to your TypeSense host, __without__ protocol prefix (http/https), __required__ 
- `typesense.api_key` - your TypeSense API key, __required__
- `typesense.index_name` - name of your index on the TypeSense host, __required__
- `typesense.query_by` - fields to query in your index, __required__
- `typesense.port` - defaults to `443` (HTTPS)
- `typesense.protocol` - defaults to `https` 
- `typesense.limit` - response page size limit, defaults to 250

### Core Data API

Configure access to the Core Data API.

- `core_data.url` - base URL
- `core_data.project_ids` - a list of project IDs




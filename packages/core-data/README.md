# Core Data Client

TODO...

## Configuration

The core data client provides runtime configuration options through a `config.json` file, located at the same path as the `index.html` host page.

Configuration covers the following aspects:

- Branding
- TypeSense server and Core Data API settings
- Base map and static layers

```json
{
  "branding": {
    "title": "Core Data",
    "map_style": "https://api.maptiler.com/maps/basic-v2-light/style.json?key=<your_api_key>",
    "related": [
      { "endpoint": "media_contents", "ui_label": "Related Media & Documents", "default_open": false },
      { "endpoint": "organizations", "ui_label": "Organizations", "default_open": false },
      { "endpoint": "people", "ui_label": "Related People", "default_open": false },
      { "endpoint": "places", "ui_label": "Related Places", "default_open": false },
      { "endpoint": "taxonomies", "ui_label": "Taxonomies", "default_open": false }
    ]
  },
  "layers": [
    { "name": "US States", "format": "geojson", "url": "gz_2010_us_040_00_20m.json", "description": "Data from the United States Census Bureau. https://eric.clst.org/tech/usgeojson/" }
  ],
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

### Branding

Work in progress!

The `branding` block provides various configuration options to influence visual appearance.

- `branding.title` - page title, displayed in the top-left of the header
- `related` - the list of __Related__ (people, places, organizations, etc.) blocks, displayed in the detail view. The order in the config file 
  determines the order in the interface. Each item in the list is an object with the following properties:
  - `endpoint` - the path segment for this "related" category on the Core Data API, e.g. "media_contents", "people", etc.
  - `ui_label` - the label to use for this category in the interface
  - `default_open` - `true` if the accordion section for this category should be open by default

### Map Layers

Configure one or more base map layers, and (optionally) static data overlays. If more than one layer is configured, the Core Data client
will render a layer switcher control in the interface.




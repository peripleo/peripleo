import { useRuntimeConfig as _useRuntimeConfig } from '@peripleo/peripleo';

export interface CoreDataConfig {

  branding: {
    
    title?: string;

    map_style: string;

    related?: {

      endpoint: string;

      ui_label: string;

      default_open?: boolean;

    }[];

  }

  layers: MapLayerConfig[];

  typesense: {
    
    host: string;

    port?: number;

    protocol?: 'http' | 'https';

    api_key: string;

    index_name: string;    

    query_by: string;

    limit?: number;

    facets?: FacetConfig;

  }

  core_data: {
    
    url: string;

    project_ids: number[];

  }

}

export interface MapLayerConfig {
    
  name: string;

  type: 'raster' | 'vector' | 'geojson';

  overlay?: boolean;

  url: string;

  description?: string;

  tilesize?: number;

  attribution?: string;

  minzoom?: number;

  maxzoom?: number;

}

export interface FacetConfig {

  include?: string[];

  exclude?: string[];

}

export const normalize = (config: CoreDataConfig) => ({
  ...config,
  layers: config.layers || [],
  typesense: {
    ...config.typesense,
    host: config.typesense.host || 443,
    protocol: config.typesense.protocol || 'https'
  },
  core_data: {
    ...config.core_data,

    // Remove trailing slash if any  
    url: config.core_data.url.endsWith('/')
      ? config.core_data.url.substring(0, config.core_data.url.length - 1)
      : config.core_data.url,

    project_ids: Array.isArray(config.core_data.project_ids)
      ? config.core_data.project_ids 
      : [config.core_data.project_ids]
  }
});

export const toLayerStyle = (config: MapLayerConfig, id: string) => {
  if (config.type === 'vector') {
    // Assumes MapBox-compatible style URL
    return config.url;
  } else if (config.type === 'raster') {
    return {
      version: 8,
      sources: {
        [id]: {
          type: 'raster',
          tiles: [ config.url ],
          tileSize: config.tilesize || 256
        }
      },
      layers: [{
        id,
        type: 'raster',
        source: id,
        minzoom: config.minzoom || 0,
        maxzoom: config.maxzoom || 22
      }]
    }
  } else {
    throw `Unsupported baselayer type: ${config.type}`;
  }
}

// Just a shorthand so that we don't need to 
// provide the type annotation over and over again
export const useRuntimeConfig = () => {
  const config = _useRuntimeConfig<CoreDataConfig>();

  const baselayers = config.layers.filter(l => !l.overlay);
  const datalayers = config.layers.filter(l => l.overlay);

  return { ...config, baselayers, datalayers };
}
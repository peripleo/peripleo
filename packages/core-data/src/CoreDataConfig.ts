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

  layers: {

    name: string;

    format: 'topojson' | 'geojson',

    url: string;

  }[];

  typesense: {
    
    host: string;

    port?: number;

    protocol?: 'http' | 'https';

    api_key: string;

    index_name: string;    

    query_by: string;

    limit?: number;

  }

  core_data: {
    
    url: string;

    project_ids: number[];

  }

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

// Just a shorthand so that we don't need to 
// provide the type annotation over and over again
export const useRuntimeConfig = () => _useRuntimeConfig<CoreDataConfig>();
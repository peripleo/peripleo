import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

export interface RuntimeConfiguration {

  branding: {
    
    title?: string;

    map_style: string;

  }

  typesense: {
    
    host: string;

    port?: number;

    protocol?: 'http' | 'https';

    api_key: string;

    index_name: string;    

  }

  core_data: {
    
    url: string;

    project_ids: number[];

  }

}

const normalize = (config: RuntimeConfiguration) => ({
  ...config,
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
})

const RuntimeConfigContext = createContext<RuntimeConfiguration>(undefined);

export const RuntimeConfig = (props: { children: ReactNode }) => {

  const [config, setConfig] = useState<RuntimeConfiguration | undefined>();

  useEffect(() => {
    fetch('config.json')
      .then(res => res.json())
      .then(data => setConfig(normalize(data)));
  }, []);

  return (
    <RuntimeConfigContext.Provider value={config}>
      {config && (props.children)}
    </RuntimeConfigContext.Provider>
  )

}

export const useRuntimeConfig = () => useContext(RuntimeConfigContext);
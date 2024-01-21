import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const RuntimeConfigContext = createContext<unknown>(undefined);

interface RuntimeConfigProps<T extends unknown> {

  children: ReactNode;

  preprocess?(config: T): T; 

}

export const RuntimeConfig = <T extends unknown>(props: RuntimeConfigProps<T>) => {

  const [config, setConfig] = useState<T | undefined>();

  useEffect(() => {
    fetch('config.json')
      .then(res => res.json())
      .then(data => props.preprocess 
          ? setConfig(props.preprocess(data)) 
          : setConfig(data));
  }, []);

  return (
    <RuntimeConfigContext.Provider value={config}>
      {config && (props.children)}
    </RuntimeConfigContext.Provider>
  )

}
export const useRuntimeConfig = <T extends unknown>() => {
  const config = useContext(RuntimeConfigContext) as T;
  return config;
};
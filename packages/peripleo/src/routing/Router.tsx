import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

interface RouterContextValue {

  urlState: { route: string, params: { [key: string]: string } };

  setUrlState:  React.Dispatch<React.SetStateAction<{ route: string, params: { [key: string]: string } }>>;

}

const RouterContext = createContext<RouterContextValue>(undefined);

const parseParams = (params?: string) => {
  if (!params?.includes('='))
    return {};

  const str = params.replace(/^[/#]+/, '').trim();
  const pairs = str.split('&');

  return Object.fromEntries(pairs.map(p => p.split('=')));
}

export const parseHash = (hash: string) => {
  const [route, params] = hash.substring(1).split(/\&(.*)/s);

  if (!route)
    return { route: '/', params: parseParams(params)};

  if (route.includes('='))
    return { route: '/', params: parseParams(hash) };

  return { route, params: parseParams(params) };
}

export const serializeHash = (arg: { route: string, params: { [key: string]: string }}): string => {
  const { route, params } = arg;

  let hash = `#${route}`;

  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  if (queryParams)
    hash += `&${queryParams}`;

  return hash;
}

/** 
 * A minimal router implementation which allows us to use the 
 * URL hash *both* for routing and persisting other things such as map state
 */
export const Router = (props: { children: ReactNode }) => {

  const [urlState, setUrlState] = 
    useState<{ route: string, params: { [key: string]: string }}>(parseHash(window.location.hash));

  useEffect(() => {
    history.pushState(null, null, serializeHash(urlState));
  }, [urlState]);

  useEffect(() => {
    const onHashChange = (evt: HashChangeEvent) => {
      const { oldURL, newURL } = evt;

      const from = parseHash(new URL(oldURL).hash);
      const to = parseHash(new URL(newURL).hash);

      if (to.route !== from.route)
        setUrlState(to);      
    }

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    }
  }, []);


  return (
    <RouterContext.Provider value={{ urlState, setUrlState }}>
      {props.children}
    </RouterContext.Provider>
  )

}

export const useCurrentRoute = () => {
  const { urlState } = useContext(RouterContext);
  return urlState.route; 
}

export const useParams = () => {
  const { urlState } = useContext(RouterContext);
  return urlState.params; 
}

export const useNavigate = () => {
  const { setUrlState } = useContext(RouterContext);

  return (route: string) => setUrlState(() => {
    const current = parseHash(window.location.hash);
    return {
      route,
      params: current.params
    }
  });
}

export const useSetParams = () => {
  const { setUrlState } = useContext(RouterContext);
  return (key: string, value: string) => setUrlState(state => ({
    route: state.route,
    params: {
      ...state.params,
      [key]: value
    }
  }));
}


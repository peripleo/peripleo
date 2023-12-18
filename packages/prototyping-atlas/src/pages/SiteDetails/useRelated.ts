import { useEffect, useState } from 'react';
import { useRuntimeConfig } from '../../CoreDataConfig';

export const useRelated = (recordId: string) => {

  const { branding, core_data } = useRuntimeConfig();

  const [state, setState] = useState<{ endpoint: string, data?: any }[]>(
    (branding.related || []).map(({ endpoint }) => ({ endpoint })));

  const fetchOne = (endpoint: string) => {
    const url = 
      `${core_data.url}/core_data/public/places/${recordId}/${endpoint}?project_ids=${core_data.project_ids.join(',')}`;

    return fetch(url).then(res => res.json());
  }

  useEffect(() => {
    const endpoints = branding.related.map(t => t.endpoint);

    endpoints.map(endpoint => fetchOne(endpoint)
      .then(data => {
        console.log('endpoint: ' + endpoint);
        console.log(data);

        setState(state => state.map(t => t.endpoint === endpoint ? ({ endpoint, data }) : t));
      })
      .catch(() => console.warn(`No results for ${recordId}/${endpoint}`))
    );
  }, []);

  return state;

}
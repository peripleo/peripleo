import { useEffect, useState } from 'react';
import { useRuntimeConfig } from '../../CoreDataConfig';

export interface RelatedItemsData {

  endpoint: string;

  ui_label: string;

  default_open?: boolean;

  data?: any;

  error?: Error;

}

export const useRelated = (recordId: string) => {

  const { branding, core_data } = useRuntimeConfig();

  const [state, setState] = useState<RelatedItemsData[]>(branding.related || []);

  const fetchOne = (endpoint: string) => {
    const url = 
      `${core_data.url}/core_data/public/places/${recordId}/${endpoint}?project_ids=${core_data.project_ids.join(',')}`;

    return fetch(url).then(res => res.json());
  }

  useEffect(() => {
    branding.related.map(conf => fetchOne(conf.endpoint)
      .then(data => {
        console.log('endpoint: ' + conf.endpoint);
        console.log(data);

        setState(state => state.map(t => t.endpoint === conf.endpoint ? ({ ...t, data }) : t));
      })
      .catch(error => {
        console.warn(`No results for ${recordId}/${conf.endpoint}`);

        setState(state => state.map(t => t.endpoint === conf.endpoint ? ({ ...t, error }) : t));
      })
    );
  }, []);

  return state;

}
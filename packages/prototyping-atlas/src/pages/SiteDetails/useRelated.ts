import { useEffect, useState } from 'react';
import { useRuntimeConfig } from '../../CoreDataConfig';

export const useRelated = (recordId: string) => {

  const { core_data } = useRuntimeConfig();

  const [media, setMedia] = useState<any>();

  const [organizations, setOrganizations] = useState<any>();

  const [people, setPeople] = useState<any>();

  const [places, setPlaces] = useState<any>();

  const [taxonomies, setTaxonomies] = useState<any>();

  const fetchOne = (endpoint: string) => {
    const url = 
      `${core_data.url}/core_data/public/places/${recordId}/${endpoint}?project_ids=${core_data.project_ids.join(',')}`;

    return fetch(url).then(res => res.json());
  }

  useEffect(() => {
    // TODO pull from config
    const endpoints = [
      'media_content',
      'organizations',
      'people',
      'places',
      'taxonomies'
    ];

    endpoints.map(endpoint => fetchOne(endpoint)
      .then(result => {
        console.log('endpoint: ' + endpoint);
        console.log(result);
      })
      .catch(() => console.warn(`No results for ${recordId}/${endpoint}`))
    );
  }, []);

}
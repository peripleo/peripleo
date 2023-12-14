import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useCachedHits } from '../../components';
import { Link, useCurrentRoute, useSelectionState } from '@peripleo/peripleo';

const VITE_CD_HOST = import.meta.env.VITE_CD_HOST.endsWith('/')
  ? import.meta.env.VITE_CD_HOST.substring(0, import.meta.env.VITE_CD_HOST.length - 1)
  : import.meta.env.VITE_CD_HOST;

const { VITE_CD_PROJECT_IDS } = import.meta.env;

export const SiteDetails = () => {

  const route = useCurrentRoute();

  const [, siteId] = route.split('/').filter(Boolean);

  const hits = useCachedHits();

  const [site, setSite] = useState<any>();

  const { setSelected } = useSelectionState();

  // Temporary! Site should be fetched from the API
  // const site = useMemo(() => hits.find(hit => hit.id == siteId), [hits, siteId]);

  /*
  const userDefinedFields: [string, string][] = useMemo(() => Object.entries(site)
    .filter(([key, _]) => key.startsWith('ey'))
    .map(([key, value]) => { 
      const payload = jwtDecode(key);
      return [ 'label' in payload ? payload.label : '', value.toString() ] as [string, string];
    }), [site]);
  */

  useEffect(() => {
    const url = `${VITE_CD_HOST}/core_data/public/places/${siteId}?project_ids=${VITE_CD_PROJECT_IDS}`;

    /*
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log('place', data);
      })

      */


    // setSelected(toFeature(site));
    /*
    return () => {
      setSelected(undefined);
    }
    */
  }, [siteId])

  return (
    <aside className="flex flex-col absolute p-3 z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <Link 
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
        to="/">
        <X className="h-4 w-4" />
      </Link>

      {site && (
        <div>
          <h1 className="pr-6 font-medium">
            {site.name.toString()}
          </h1>

          <ol className="text-sm mt-4 leading-6 overflow-hidden">
            {/* userDefinedFields.map(([key, value]) => (
              <li key={key} className="mb-2">
                <div className="text-muted">{key}</div>
                <div className="font-medium overflow-hidden text-ellipsis">{value}</div>
              </li>
            )) */}
          </ol>
        </div>
      )}
    </aside>
  )

}
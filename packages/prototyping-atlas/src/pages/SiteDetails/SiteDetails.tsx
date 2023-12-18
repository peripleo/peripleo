import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link, Place, useCurrentRoute, useSelectionState } from '@peripleo/peripleo';
import { toFeature } from '../../model/CoreData';
import { useRuntimeConfig } from '../../CoreDataConfig';

export const SiteDetails = () => {

  const route = useCurrentRoute();

  const { core_data } = useRuntimeConfig();

  const [, recordId] = route.split('/').filter(Boolean);

  const [site, setSite] = useState<Place>();

  const { setSelected } = useSelectionState();

  /*
  const userDefinedFields: [string, string][] = useMemo(() => Object.entries(site)
    .filter(([key, _]) => key.startsWith('ey'))
    .map(([key, value]) => { 
      const payload = jwtDecode(key);
      return [ 'label' in payload ? payload.label : '', value.toString() ] as [string, string];
    }), [site]);
  */

  useEffect(() => {
    const url = 
      `${core_data.url}/core_data/public/places/${recordId}?project_ids=${core_data.project_ids.join(',')}`;

    fetch(url)
      .then(res => res.json())
      .then(({ place }) => {
        setSite(place);

        console.log(place);

        const feature = toFeature(place, recordId);
        setSelected(feature);
      });

    return () => {
      setSelected(undefined);
    } 
  }, [recordId])

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
            {site.properties.title}
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
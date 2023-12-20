import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Link, useCurrentRoute, useSelectionState } from '@peripleo/peripleo';
import { RelatedItemsList } from '../../components/RelatedItems';
import { CoreDataPlace, UserDefinedField, toFeature } from '../../model/CoreData';
import { useRuntimeConfig } from '../../CoreDataConfig';

export const SiteDetails = () => {

  const route = useCurrentRoute();

  const { core_data } = useRuntimeConfig();

  const [, recordId] = route.split('/').filter(Boolean);

  const [site, setSite] = useState<CoreDataPlace>();

  const { setSelected } = useSelectionState();

  const userDefined: UserDefinedField[]= site?.user_defined ? Object.values(site.user_defined) : [];

  useEffect(() => {
    const url = 
      `${core_data.url}/core_data/public/places/${recordId}?project_ids=${core_data.project_ids.join(',')}`;

    fetch(url)
      .then(res => res.json())
      .then(place => {
        setSite(place);

        const feature = toFeature(place, recordId);
        setSelected(feature);
      });

    return () => {
      setSelected(undefined);
    } 
  }, [recordId]);

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <Link 
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
        to="/">
        <X className="h-4 w-4" />
      </Link>

      {site && (
        <>
          <div className="p-3">
            <h1 className="pr-6 font-medium">
              {site.properties.title}
            </h1>

            <ol className="text-sm mt-4 leading-6 overflow-hidden">
              {userDefined.map(({ label, value }) => (
                <li key={label} className="mb-2">
                  <div className="text-muted">{label}</div>
                  <div className="font-medium overflow-hidden text-ellipsis">{value}</div>
                </li>
              ))}
            </ol>
          </div>

          <RelatedItemsList recordId={recordId} />
        </>
      )}
    </aside>
  )

}
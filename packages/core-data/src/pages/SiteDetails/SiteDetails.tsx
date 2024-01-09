import { useEffect, useMemo, useState } from 'react';
import { Image, X } from 'lucide-react';
import { Link, useCurrentRoute, useSelectionState } from '@peripleo/peripleo';
import { RelatedItemsList, useRelated } from '../../components';
import { useRuntimeConfig } from '../../CoreDataConfig';
import { SiteDetailsLayer } from './SiteDetailsLayer';
import { 
  CoreDataMedia, 
  CoreDataPlace, 
  CoreDataPlaceFeature, 
  UserDefinedField, 
  toFeature 
} from '../../model';

export const SiteDetails = () => {

  const route = useCurrentRoute();

  const { core_data } = useRuntimeConfig();

  const [, uuid] = route.split('/').filter(Boolean);

  const [site, setSite] = useState<CoreDataPlaceFeature>();

  const { setSelected } = useSelectionState();

  const userDefined: UserDefinedField[]= site?.user_defined ? Object.values(site.user_defined) : [];

  const related = useRelated(uuid);

  useEffect(() => {
    const url = 
      `${core_data.url}/core_data/public/places/${uuid}?project_ids=${core_data.project_ids.join(',')}`;

    fetch(url)
      .then(res => res.json())
      .then(place => {
        setSite(place);

        const feature = toFeature(place, place.record_id);
        setSelected(feature);
      });

    return () => {
      setSelected(undefined);
    } 
  }, [uuid]);

  const firstImage = useMemo(() => {
    const images = related.find(i => i.endpoint === 'media_contents' && i.data?.items?.length > 0);
    return images ? (images.data.items[0].body as CoreDataMedia) : undefined;
  }, [related]);

  const relatedPlaces = useMemo(() => {
    const places = related.find(i => i.endpoint === 'places' && i.data);
    return places ? places.data.items.map(a => a.body as CoreDataPlace) : undefined;
  }, [related]);

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur 
      shadow overflow-y-auto">
      <Link 
        className="absolute top-2 right-2 p-1.5 rounded-full z-10 bg-slate-200/60 hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
        to="/">
        <X className="h-4 w-4" />
      </Link>

      {site && (
        <>
          {firstImage && (
            <div className="relative w-full h-[200px] flex-grow-0 flex-shrink-0 bg-muted/20 z-0">
              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                <Image className="h-20 w-20 text-gray-400" strokeWidth={1} />
              </div>

              <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
              <img
                className="object-cover h-full w-full"
                src={firstImage.content_url} 
                alt={firstImage.title} />
              </div>
            </div>
          )}

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

          <RelatedItemsList items={related} />
        </>
      )}

      {site && (
        <SiteDetailsLayer 
          place={site} 
          related={relatedPlaces} />
      )}
    </aside>
  )

}
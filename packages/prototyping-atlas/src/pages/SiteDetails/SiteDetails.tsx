import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useInfiniteHits } from 'react-instantsearch';
import { Link, useParams } from 'react-router-dom';

export const SiteDetails = () => {

  const { siteId }  = useParams();

  const { hits } = useInfiniteHits();

  const site = useMemo(() => hits.find(hit => hit.id === siteId), [siteId]);

  useEffect(() => {
    console.log(site);
  }, [site]);

  return (
    <aside className="flex flex-col absolute p-3 z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <Link 
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
        to="/">
        <X className="h-4 w-4" />
      </Link>
      
      <h1 className="pr-6 font-medium">
        {site.name.toString()}
      </h1>

      <ol className="text-sm mt-4 leading-6 overflow-hidden">
        {(site.user_defined as any[]).map(record => (
          <li key={record.label} className="mb-2">
            <div className="text-muted">{record.label}</div>
            <div className="font-medium overflow-hidden text-ellipsis">{record.value}</div>
          </li>
        ))}
      </ol>
    </aside>
  )

}
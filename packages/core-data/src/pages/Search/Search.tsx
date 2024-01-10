import { useMap } from '@peripleo/peripleo/maplibre';
import bbox from '@turf/bbox';
import { toFeature } from '../../components/TypeSenseSearch';
import { 
  SearchBox, 
  SearchFilterSettings, 
  SearchResultsList, 
  useGeoSearch, 
  useSearchCompleted 
} from '../../components';

export const Search = () => {

  const map = useMap();

  const { isRefinedWithMap } = useGeoSearch();

  useSearchCompleted(hits => {
    if (map && hits.length > 0 && !isRefinedWithMap()) {
      const features = hits.map(hit => toFeature(hit));

      const [minX, minY, maxX, maxY] = bbox({ type: 'FeatureCollection', features });
      
      map.fitBounds([[minX, minY], [maxX, maxY]], { 
        padding: { top: 100, bottom: 100, left: 380, right: 120 },
        maxZoom: 14
      });
    }
  }, [map, isRefinedWithMap()]);

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <div className="flex gap-2 items-center border-b p-3">
        <SearchBox />
        <SearchFilterSettings />
      </div>
  
      <div className="overflow-y-auto flex-grow">
        <SearchResultsList />
      </div>
    </aside>
  )

}
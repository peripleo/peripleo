import { useMap } from '@peripleo/peripleo/maplibre';
import bbox from '@turf/bbox';
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
      const features = {
        type: 'FeatureCollection',
        features: hits
          // For some reason, 0/0 points throw turf off :-(
          .filter(h => 'geometry' in h && (h.coordinates[0] !== 0 || h.coordinates[1] !== 0))
      };

      const [minX, minY, maxX, maxY] = bbox(features);
      
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
import { useEffect, useState } from 'react';
import { FeatureCollection } from '@peripleo/peripleo';
import bbox from '@turf/bbox';
import { MixedGeoJSONLayer, PulsingMarkerLayer, Tooltip, useMap } from '@peripleo/peripleo/maplibre';
import { CoreDataPlace, CoreDataPlaceFeature, toFeature } from '../../model';
import { POINT_STYLE, FILL_STYLE, STROKE_STYLE } from '../../layerStyles';
import { useRuntimeConfig } from '../../CoreDataConfig';
import { SiteDetailsTooltip } from './SiteDetailsTooltip';

interface SiteDetailsLayerProps {

  place: CoreDataPlaceFeature;

  related?: CoreDataPlace[];

}

export const SiteDetailsLayer = (props: SiteDetailsLayerProps) => {

  const { place } = props;

  // @ts-ignore
  const recordId: string = place.record_id;

  const geometry: FeatureCollection = {
    type: 'FeatureCollection',
    features: [toFeature(place, recordId)]
  };

  const { core_data } = useRuntimeConfig();

  const map = useMap();

  const [related, setRelated] = useState<FeatureCollection>();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) {
      const all = related
        ? { type: 'FeatureCollection', features: [...geometry.features, ...related.features]}
        : geometry;

      const [minX, minY, maxX, maxY] = bbox(all);
      
      map.fitBounds([[minX, minY], [maxX, maxY]], { 
        padding: 100,
        maxZoom: 14
      });
    }
  }, [loaded, related]);

  useEffect(() => {
    if (props.related) {
      const urls = props.related.map(r =>
        `${core_data.url}/core_data/public/places/${r.record_id}?project_ids=${core_data.project_ids.join(',')}`);

      Promise.all(urls.map(url => fetch(url).then(res => res.json())))
        .then(places => {
          const features = places.map(p => toFeature(p, p.record_id));

          setRelated({
            type: 'FeatureCollection',
            features
          });

          setLoaded(true);
        });
    }
  }, [props.related?.map(r => r.id).join()]);

  return (
    <>
      <PulsingMarkerLayer 
        id="current" 
        data={geometry} />

      {related && (
        <MixedGeoJSONLayer
          id={`${recordId}-related`} 
          fillStyle={FILL_STYLE}
          strokeStyle={STROKE_STYLE}
          pointStyle={POINT_STYLE}
          data={related}
          tooltip={(target) => (
            <SiteDetailsTooltip target={target} />
          )} />
      )}

      <MixedGeoJSONLayer
        id={recordId} 
        data={geometry} 
        fillStyle={FILL_STYLE} 
        strokeStyle={STROKE_STYLE} 
        pointStyle={POINT_STYLE} 
        tooltip={(target) => (
          <SiteDetailsTooltip target={target} />
        )} />
    </>
  );

}
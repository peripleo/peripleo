import { useEffect, useState } from 'react';
import { FeatureCollection } from '@peripleo/peripleo';
import bbox from '@turf/bbox';
import { MixedGeoJSONLayer, PulsingMarkerLayer, useMap } from '@peripleo/peripleo/maplibre';
import { CoreDataPlace, CoreDataPlaceFeature, toFeature } from '../../model';
import { POINT_STYLE, FILL_STYLE, STROKE_STYLE } from '../../layerStyles';
import { useRuntimeConfig } from '../../CoreDataConfig';
import { SiteDetailsTooltip } from './SiteDetailsTooltip';

interface SiteDetailsLayerProps {

  uuid: string;

  place: CoreDataPlaceFeature;

  related?: CoreDataPlace[];

}

export const SiteDetailsLayer = (props: SiteDetailsLayerProps) => {

  const { place } = props;

  const geometry: FeatureCollection = {
    type: 'FeatureCollection',
    features: [toFeature(place, parseInt(place.record_id))]
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
        padding: { top: 100, bottom: 100, left: 380, right: 120 },
        maxZoom: 14
      });
    }
  }, [loaded, related]);

  useEffect(() => {
    if (props.related) {
      const urls = props.related.map(r =>
        `${core_data.url}/core_data/public/places/${props.uuid}?project_ids=${core_data.project_ids.join(',')}`);

      Promise.all(urls.map(url => fetch(url).then(res => res.json())))
        .then(places => {
          const features = places.map(p => toFeature(p, p.uuid));

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
          id={`${place.record_id}-related`} 
          fillStyle={FILL_STYLE}
          strokeStyle={STROKE_STYLE}
          pointStyle={POINT_STYLE}
          data={related}
          tooltip={(target) => (
            <SiteDetailsTooltip target={target} />
          )} />
      )}

      <MixedGeoJSONLayer
        id={place.record_id} 
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
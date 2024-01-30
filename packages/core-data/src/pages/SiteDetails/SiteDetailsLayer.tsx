import { useEffect, useMemo } from 'react';
import { FeatureCollection } from '@peripleo/peripleo';
import bbox from '@turf/bbox';
import { MixedGeoJSONLayer, PulsingMarkerLayer, useMap } from '@peripleo/maplibre';
import { CoreDataPlace, CoreDataPlaceFeature, CoreDataProperties, toFeature } from '../../model';
import { POINT_STYLE, FILL_STYLE, STROKE_STYLE } from '../../layerStyles';
import { SiteDetailsTooltip } from './SiteDetailsTooltip';

interface SiteDetailsLayerProps {

  uuid: string;

  place: CoreDataPlaceFeature;

  related?: CoreDataPlace[];

}

export const SiteDetailsLayer = (props: SiteDetailsLayerProps) => {

  const map = useMap();

  const place = {
    type: 'FeatureCollection',
    features: [toFeature(props.place, props.place.properties.uuid)]
  } as FeatureCollection<CoreDataProperties>;

  const related = useMemo(() => ({
    type: 'FeatureCollection', 
    features: (props.related || []).map(p => ({
      id: parseInt(p.record_id),
      type: 'Feature',
      properties: {
        title: p.title,
        record_id: p.record_id,
        uuid: p.uuid
      },
      geometry: p.geometry
    }))
  } as FeatureCollection<CoreDataPlace>), [props.related]); 

  useEffect(() => {
    const allFeatures = { 
      type: 'FeatureCollection', 
      features: [...place.features, ...related.features]
    };

    const [minX, minY, maxX, maxY] = bbox(allFeatures);
    
    map.fitBounds([[minX, minY], [maxX, maxY]], { 
      padding: { top: 100, bottom: 100, left: 380, right: 120 },
      maxZoom: 14
    });
  }, [props.uuid, related]);

  return (
    <>
      <PulsingMarkerLayer 
        key={props.uuid}
        id="current" 
        data={place} />

      {props.related && (
        <MixedGeoJSONLayer
          id={`${props.place.record_id}-related`} 
          interactive
          fillStyle={FILL_STYLE}
          strokeStyle={STROKE_STYLE}
          pointStyle={POINT_STYLE}
          data={related}
          tooltip={(target) => (
            <SiteDetailsTooltip target={target} />
          )} />
      )}

      <MixedGeoJSONLayer
        id={props.place.record_id} 
        interactive
        data={place} 
        fillStyle={FILL_STYLE} 
        strokeStyle={STROKE_STYLE} 
        pointStyle={POINT_STYLE} 
        tooltip={(target) => (
          <SiteDetailsTooltip target={target} />
        )} />
    </>
  );

}
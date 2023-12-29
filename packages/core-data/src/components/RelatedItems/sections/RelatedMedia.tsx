import { useState } from 'react';
import { AnnotationPage } from '@peripleo/peripleo';
import { Thumbnail } from '@samvera/clover-iiif/primitives';
import { CoreDataMedia } from '../../../model';
import { MediaGallery } from '../../../components/MediaGallery';

interface RelatedMediaProps {

  data: AnnotationPage<CoreDataMedia>;

}

export const RelatedMedia = (props: RelatedMediaProps) => {

  const { data } = props;

  const [showGallery, setShowGallery] = useState<CoreDataMedia>();

  return (
    <div className="p-3 pb-4 grid grid-cols-3 gap-1">
      {data.items.map(item => (
        <Thumbnail 
          key={item.body.id} 
          className="rounded shadow cursor-pointer"
          onClick={() => setShowGallery(item.body)}
          thumbnail={[{
            id: item.body.content_thumbnail_url,
            type: 'Image',
            width: 80,
            height: 80
          }]} />
      ))}

      <MediaGallery 
        defaultItem={showGallery} 
        onClose={() => setShowGallery(undefined)} />
    </div>
  )

}
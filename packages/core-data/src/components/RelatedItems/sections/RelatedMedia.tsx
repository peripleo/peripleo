import { Thumbnail } from '@samvera/clover-iiif/primitives';

interface RelatedMediaProps {

  data: any;

}

export const RelatedMedia = (props: RelatedMediaProps) => {

  const { data } = props;

  console.log(data);

  return (
    <div className="p-3 pb-4 grid grid-cols-3 gap-1">
      {data.items.map(item => (
        <Thumbnail 
          key={item.body.id} 
          className="rounded shadow cursor-pointer"
          thumbnail={[{
            id: item.body.content_thumbnail_url,
            type: 'Image',
            width: 80,
            height: 80
          }]} />
      ))}
    </div>
  )

}
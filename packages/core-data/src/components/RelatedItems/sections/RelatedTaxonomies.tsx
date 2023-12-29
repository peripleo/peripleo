import { AnnotationPage } from '@peripleo/peripleo';
import { ListTree } from 'lucide-react';
import { CoreDataTaxonomy } from '../../../model';

interface RelatedTaxonomiesProps {

  data: AnnotationPage<CoreDataTaxonomy>;

}

export const RelatedTaxonomies = (props: RelatedTaxonomiesProps) => {

  const taxonomies = props.data.items;

  return taxonomies.length === 0 ? (
    <div className="pt-6 pl-3 pr-6 pb-8 flex items-center justify-center text-muted/50 italic">
      No related taxonomies
    </div>
  ) : (
    <ul className="p-3 pt-1 pb-4">
      {taxonomies.map(a => (
        <li key={a.id} className="flex items-center">
          <ListTree className="h-4 w-4 mr-1.5" /> {a.body.title}
        </li>
      ))}
    </ul>
  )

}
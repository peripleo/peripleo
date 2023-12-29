import { AnnotationPage } from '@peripleo/peripleo';
import { Building2 } from 'lucide-react';
import { CoreDataOrganization } from '../../../model';

interface RelatedOrganizationProps {

  data: AnnotationPage<CoreDataOrganization>;

}

export const RelatedOrganizations = (props: RelatedOrganizationProps) => {

  const organizations = props.data.items;

  return organizations.length === 0 ? (
    <div className="pt-6 pl-3 pr-6 pb-8 flex items-center justify-center text-muted/50 italic">
      No related organizations
    </div>
  ) : (
    <ul className="p-3 pt-1 pb-4">
      {organizations.map(a => (
        <li key={a.id} className="flex items-center">
          <Building2 className="h-4 w-4 mr-1.5" /> {a.body.title}
        </li>
      ))}
    </ul>
  )

}
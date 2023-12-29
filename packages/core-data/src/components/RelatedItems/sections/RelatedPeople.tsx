import { AnnotationPage } from '@peripleo/peripleo';
import { UserCircle } from 'lucide-react';
import { CoreDataPerson } from '../../../model';

interface RelatedPeopleProps {

  data: AnnotationPage<CoreDataPerson>;

}

export const RelatedPeople = (props: RelatedPeopleProps) => {

  const people = props.data.items;

  return people.length === 0 ? (
    <div className="pt-6 pl-3 pr-6 pb-8 flex items-center justify-center text-muted/50 italic">
      No related people
    </div>
  ) : (
    <ul className="p-3 pt-1 pb-4">
      {people.map(a => (
        <li className="flex items-center">
          <UserCircle className="h-4 w-4 mr-1.5" /> {a.body.title}
        </li>
      ))}
    </ul>
  )

}
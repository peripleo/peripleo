import { AnnotationPage } from '@peripleo/peripleo';
import * as Accordion from '@radix-ui/react-accordion';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { CoreDataMedia, CoreDataOrganization, CoreDataPerson, CoreDataPlace, CoreDataTaxonomy} from '../../model';
import { ThreeDots } from '../LoadAnimations';
import { RelatedItemsData } from './useRelated';
import { 
  RelatedMedia, 
  RelatedOrganizations, 
  RelatedPeople, 
  RelatedPlaces, 
  RelatedTaxonomies 
} from './sections';

import './RelatedItemsList.css';

interface RelatedItemsListProps {

  recordId: string;

  items: RelatedItemsData[];

}

export const RelatedItemsList = (props: RelatedItemsListProps) => {

  return props.items.length > 0 && (
    <Accordion.Root type="multiple">
      {props.items.map(({ data, error, ...conf }) => (
        <Accordion.Item value={conf.endpoint} key={conf.endpoint}>
          <Accordion.Header>
            <Accordion.Trigger 
              className="accordion-trigger border-black/20 border border-t border-b-0 border-l-0 border-r-0 border-solid 
                rounded-none w-full flex justify-between items-center px-3 py-3 text-sm">
              <div>
                {conf.ui_label}

                {data ? (
                  <span className="ml-1">({data.items.length})</span>
                ) : error ? (
                  <AlertCircle className="inline ml-1.5 h-4 w-4 text-red-600 align-text-bottom" />
                ) : (
                  <ThreeDots className="text-muted/60 ml-4"/>
                )}
              </div>

              <ChevronDown className="accordion-chevron h-4 w-4" />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content className="accordion-content text-sm leading-6">
            {conf.endpoint === 'media_contents' ? (
              <RelatedMedia data={data as AnnotationPage<CoreDataMedia>} />
            ) : conf.endpoint === 'organizations' ? (
              <RelatedOrganizations data={data as AnnotationPage<CoreDataOrganization>} />
            ) : conf.endpoint === 'people' ? (
              <RelatedPeople data={data as AnnotationPage<CoreDataPerson>} />
            ) : conf.endpoint === 'places' ? (
              <RelatedPlaces data={data as AnnotationPage<CoreDataPlace>} />
            ) : conf.endpoint === 'taxonomies' ? (
              <RelatedTaxonomies data={data as AnnotationPage<CoreDataTaxonomy>} />
            ) : undefined}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )

}
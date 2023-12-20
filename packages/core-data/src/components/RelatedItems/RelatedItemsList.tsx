import * as Accordion from '@radix-ui/react-accordion';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { ThreeDots } from '../LoadAnimations';
import { useRelated } from './useRelated';

interface RelatedItemsListProps {

  recordId: string;

}

export const RelatedItemsList = (props: RelatedItemsListProps) => {

  const related = useRelated(props.recordId);

  console.log(related);

  return related.length > 0 && (
    <Accordion.Root type="multiple">
      {related.map(({ data, error, ...conf }) => (
        <Accordion.Item value={conf.endpoint}>
          <Accordion.Header>
            <Accordion.Trigger 
              className="border-black/20 border border-t border-b-0 border-l-0 border-r-0 border-solid 
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

              <ChevronDown className="h-4 w-4" />
            </Accordion.Trigger>
          </Accordion.Header>

          <Accordion.Content>
            Lorem Ipsum
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )

}
import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import * as Popover from '@radix-ui/react-popover';

import './MoreTags.css';

interface MoreTagsProps {

  tags: string[];

  pinned?: string;

  onTogglePin(tag: string): void;

}

export const MoreTags = (props: MoreTagsProps) => {

  const { tags, pinned, onTogglePin } = props;

  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="more-tags">
          <CaretDown size={10} weight="bold" /> {tags.length - 2} more
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content className="p6o-more-tags-popover popover-content" align="start" sideOffset={10}>
          <ul>
            {tags.map(tag => (
              <li key={tag}>
                <button 
                  className={pinned === tag ? 'pinned' : undefined}
                  onClick={() => onTogglePin(tag)}>{tag}</button>
              </li>
            ))}
          </ul>

          <Popover.Arrow className="popover-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )

} 
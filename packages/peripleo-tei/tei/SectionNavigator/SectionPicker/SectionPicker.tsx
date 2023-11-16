import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ArrowRight, BookOpenText } from '@phosphor-icons/react';
import { Section } from '../Section';

import './SectionPicker.css';
import { FormEvent } from 'react';

interface SectionPickerProps {

  sections: Section[];

  cursor: number;

  onJumpTo(arg: { chapter: number, section: number }): void;

}

export const SectionPicker = (props: SectionPickerProps) => {

  const { cursor, sections } = props;

  const [open, setOpen] = useState(false);

  const [invalid, setInvalid] = useState(false);

  const getSectionNumber = () => {
    const currentSection = cursor > -1 ? sections[cursor] : undefined;
    if (!currentSection)
      return '';

    const { element } = currentSection;

    const chapter = element.parentElement.getAttribute('n');
    const section = element.getAttribute('n');

    return `${chapter}.${section}`;
  }

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    const str = (evt.target as HTMLFormElement).elements['section'].value;
    if (!str)
      return;

    const isValid = /^\d+\.\d+$/.test(str);
    if (isValid) {
      setInvalid(false);

      const [ chapter, section ] = str.split('.');
      props.onJumpTo({ chapter, section });
      setOpen(false);
    } else {
      setInvalid(true);
    }
  }

  return (
    <div className="p6o-teiview-nav-picker">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button>
            <BookOpenText size={16} /> {getSectionNumber()} 
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content className="p6o-teiview-nav-picker-popover popover-content" align="start" sideOffset={10}>
            <form onSubmit={onSubmit}>
              <fieldset>
                <label className="Label" htmlFor="width">
                  Jump to Section
                </label>

                <div className="field">
                  <input id="section" name="section" />

                  <button className="round">
                    <ArrowRight size={16} />
                  </button>
                </div>

                {invalid && (
                  <div className="field-error">
                    Invalid input. E.g. 2.4.
                  </div>
                )}
              </fieldset>
            </form>

            <Popover.Arrow className="popover-arrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )

}
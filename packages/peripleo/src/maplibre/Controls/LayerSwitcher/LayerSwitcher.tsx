import { Children, ReactNode, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { CheckCircle, Circle, Stack } from '@phosphor-icons/react';

interface LayerSwitcherProps {

  title?: string;

  children: ReactNode;

  names: string[];

}

export const LayerSwitcher = (props: LayerSwitcherProps) => {

  const children = Children.toArray(props.children);

  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (name: string) => (checked: boolean) => {
    if (checked) {
      setChecked(c => ([...c, name]));
    } else {
      setChecked(c => c.filter(n => n !== name));
    }
  }

  const onSelect = (evt: Event) => {
    // Prevents the dropdown from closing on click
    evt.stopPropagation();
    evt.preventDefault();
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button 
            className="p6o-control p6o-control-btn"
            aria-label="Select map layers">
            <Stack size={20} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content side="left" sideOffset={8} className="dropdown-content">
            <DropdownMenu.Label className="dropdown-label">
              {props.title || 'Layers'}
            </DropdownMenu.Label>

            <DropdownMenu.Separator className="dropdown-separator" />

            {props.names.map(name => (
              <DropdownMenu.CheckboxItem
                key={name}
                className="dropdown-item dropdown-checkbox-item"
                checked={checked.includes(name)}
                onCheckedChange={toggle(name)}
                onSelect={onSelect}>

                <DropdownMenu.ItemIndicator className="dropdown-indicator">
                  <CheckCircle size={20} weight="fill" />
                </DropdownMenu.ItemIndicator>

                {!checked.includes(name) && (
                  <span className="dropdown-indicator"><Circle size={20} weight="bold" /></span>
                )}

                {name}
              </DropdownMenu.CheckboxItem>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {props.names.filter(n => checked.includes(n)).map(name => (
        children[props.names.indexOf(name)]
      ))}
    </>
  )

}
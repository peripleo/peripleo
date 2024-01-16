import { useEffect, useState } from 'react';
import { Check, Dot, Layers } from 'lucide-react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { MapLayerConfig, useRuntimeConfig } from '../../CoreDataConfig';

interface LayerMenuProps {

  onChangeBaselayer(config: MapLayerConfig): void;

  onChangeOverlays(visible: MapLayerConfig[]): void;

}

export const LayerMenu = (props: LayerMenuProps) => {

  const { baselayers, datalayers } = useRuntimeConfig();

  const [baselayer, setBaselayer] = useState(baselayers[0].name);

  const [selectedOverlays, setSelectedOverlays] = useState<{ [name: string]: boolean }>({});

  const onToggleOverlay = (name: string) => (checked: boolean) =>
    setSelectedOverlays(state => ({
      ...state,
      [name]: checked
    }));

  useEffect(() => {
    props.onChangeBaselayer(baselayers.find(b => b.name === baselayer));
  }, [baselayer]);

  useEffect(() => {
    const visible = Object.entries(selectedOverlays)
      .filter(([_, visible]) => visible)
      .map(([name, _]) => datalayers.find(l => l.name === name))
      .filter(Boolean);

    props.onChangeOverlays(visible);
  }, [selectedOverlays]);

  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <button 
            className="p6o-control p6o-control-btn"
            aria-label="Select map layers">
            <Layers className="h-4 w-4" />
          </button>
        </Dropdown.Trigger>

        <Dropdown.Portal>
          <Dropdown.Content
            side="left" 
            sideOffset={10}
            align="start"
            className="bg-white/80 max-h-[50vh] overflow-y-auto backdrop-blur z-20 shadow-md rounded-md max-w-lg p-4 outline-none">

            <Dropdown.Label 
              className="w-full font-medium text-sm text-muted">Baselayers</Dropdown.Label>

            <Dropdown.RadioGroup 
              value={baselayer} 
              onValueChange={setBaselayer}
              className="py-1.5">
              {baselayers.map(b => (
                <Dropdown.RadioItem 
                  key={b.name}
                  value={b.name}
                  className="outline-none relative pl-7 pr-2 py-0.5 rounded-md cursor-pointer hover:bg-teal-700/10">
                  <Dropdown.ItemIndicator className="absolute -left-1 -top-0.5">
                    <Dot className="w-8 h-8" />
                  </Dropdown.ItemIndicator>
                  {b.name}
                </Dropdown.RadioItem>
              ))}
            </Dropdown.RadioGroup>

            <Dropdown.Separator className="w-full border-b my-2" />

            <Dropdown.Label 
              className="w-full font-medium text-sm text-muted">Overlays</Dropdown.Label>

            <div className="pt-1.5">
              {datalayers.map(o => (
                <Dropdown.CheckboxItem
                  key={o.name}
                  checked={selectedOverlays[o.name]}
                  onCheckedChange={onToggleOverlay(o.name)}
                  className="outline-none relative pl-7 pr-2 py-0.5 rounded-md cursor-pointer hover:bg-teal-700/10">
                  <Dropdown.ItemIndicator className="absolute left-1 top-1.5">
                    <Check className="w-4 h-4" />
                  </Dropdown.ItemIndicator>
                  {o.name}
                </Dropdown.CheckboxItem>
              ))}
            </div>
          </Dropdown.Content>
        </Dropdown.Portal>
      </Dropdown.Root>
    </>
  );

}
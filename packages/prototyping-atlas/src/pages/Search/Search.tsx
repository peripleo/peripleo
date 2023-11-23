import * as Popover from '@radix-ui/react-popover';
import { Settings2 } from 'lucide-react';
import { RefinementList, SearchBox, SearchResultList } from '../../components';

export const Search = () => {

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <div className="flex gap-2 items-center border-b p-3">
        <SearchBox />

        <Popover.Root>
          <Popover.Trigger className="p-2 rounded-full hover:bg-slate-300">
            <Settings2 className="h-4 w-4" />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content 
              side="right" 
              sideOffset={10}
              className="bg-white z-20 shadow p-2 rounded">
              <RefinementList />
            </Popover.Content>
          </Popover.Portal>    
        </Popover.Root>
      </div>
  
      <div className="overflow-y-auto">
        <SearchResultList />
      </div>
    </aside>
  )

}
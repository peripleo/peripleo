import * as Popover from '@radix-ui/react-popover';
import { Settings2, X } from 'lucide-react';
import { SearchBox, SearchFilterSettings, SearchResultList } from '../../components';

export const Search = () => {

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <div className="flex gap-2 items-center border-b p-3">
        <SearchBox />

        <Popover.Root>
          <Popover.Trigger className="p-2 rounded-full hover:bg-slate-300 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
            <Settings2 className="h-4 w-4" />
          </Popover.Trigger>

          <Popover.Portal>
            <Popover.Content 
              side="right" 
              sideOffset={20}
              align="start"
              alignOffset={-5}
              className="bg-white/80 backdrop-blur z-20 shadow-md rounded-md w-72 max-w-lg p-4 outline-none">
              <SearchFilterSettings />

              <Popover.Close className="absolute top-3 p-1.5 right-3 rounded-full hover:bg-slate-200 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700">
                <X className="h-4 w-4" />
              </Popover.Close>
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
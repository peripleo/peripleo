import { FormEvent } from 'react';
import { SearchBoxProps, useSearchBox } from 'react-instantsearch';
import { Search, Settings2 } from 'lucide-react';

export const SearchBox = (props: SearchBoxProps) => {

  const {
    query,
    refine,
  } = useSearchBox(props);

  const onSubmit = (evt: FormEvent) => evt.preventDefault();

  return (
    <form onSubmit={onSubmit} className="flex gap-2 items-center p-3 border-b">
      <div className="relative flex-grow">
        <Search className="absolute h-full w-4 ml-2 flex pb-0.5" />

        <input 
          className="w-full text-sm py-1.5 pr-3 pl-8 rounded-full bg-slate-300 placeholder-slate-
            focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
          spellCheck={false}
          value={query} 
          placeholder="Search"
          onChange={evt => refine(evt.target.value)} />
      </div>

      <button className="p-2 rounded-full hover:bg-slate-300">
        <Settings2 className="h-4 w-4" />
      </button>
    </form>
  )
  
}
import { SearchBox, SearchFilterSettings, SearchResultsList } from '../../components';

export const Search = () => {

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <div className="flex gap-2 items-center border-b p-3">
        <SearchBox />
        <SearchFilterSettings />
      </div>
  
      <div className="overflow-y-auto flex-grow">
        <SearchResultsList />
      </div>
    </aside>
  )

}
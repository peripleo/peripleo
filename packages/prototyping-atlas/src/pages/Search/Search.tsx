import { SearchBox, SearchResultList } from '../../components';

export const Search = () => {

  return (
    <aside className="flex flex-col absolute z-10 h-full w-[280px] bg-white/80 backdrop-blur shadow overflow-hidden">
      <SearchBox />
  
      <div className="overflow-y-auto">
        <SearchResultList />
      </div>
    </aside>
  )

}
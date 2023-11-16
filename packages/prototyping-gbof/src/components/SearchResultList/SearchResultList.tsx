import { SearchStatus, useSearch } from '@peripleo/peripleo';
import { CoreDataPlace } from 'src/coredata/Types';

export const SearchResultList = () => {

  const { search } = useSearch<CoreDataPlace>();

  return search.status === SearchStatus.OK ? (
    <div className="p6o-control">
      <ul>
        {search.result.items.map(item => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>
    </div>
  ) : null;
  
}
import { FormEvent } from 'react';
import { SearchBoxProps, useSearchBox } from 'react-instantsearch';

export const SearchBox = (props: SearchBoxProps) => {

  const {
    query,
    refine,
  } = useSearchBox(props);

  const onSubmit = (evt: FormEvent) => evt.preventDefault();

  return (
    <form className="p6o-control" onSubmit={onSubmit}>
      <input 
        className="py-2 px-3.5 text-base rounded-full w-[300px] border"
        spellCheck={false}
        value={query} 
        onChange={evt => refine(evt.target.value)} />
    </form>
  )
  
}
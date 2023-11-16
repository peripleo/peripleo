import { useSearch } from '@peripleo/peripleo';
import { FormEvent, useState} from 'react';

export const SearchInput = () => {

  const { changeSearchQuery } = useSearch();

  const [value, setValue] = useState('');

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    changeSearchQuery(value);
  }

  return (
    <form className="p6o-control" onSubmit={onSubmit}>
      <input 
        className="py-2 px-3.5 text-base rounded-full w-[300px]"
        spellCheck={false}
        value={value} 
        onChange={evt => setValue(evt.target.value)} />
    </form>
  )

}
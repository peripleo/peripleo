import { ReactNode } from 'react';

interface CoreDataSearchProviderProps {

  children: ReactNode

}

export const CoreDataSearchProvider = (props: CoreDataSearchProviderProps) => {

  return <>{props.children}</>

}
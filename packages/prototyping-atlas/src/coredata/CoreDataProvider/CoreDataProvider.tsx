import { ReactNode } from 'react';

interface CoreDataSearchProviderProps {

  children: ReactNode

}

export const CoreDataProvider = (props: CoreDataSearchProviderProps) => {

  return <>{props.children}</>

}
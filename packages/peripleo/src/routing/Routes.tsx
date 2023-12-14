import { Children, ReactNode } from 'react';
import { useCurrentRoute } from './Router';

interface RoutesProps {

  children: ReactNode;

}

export const Routes = (props: RoutesProps) => {

  const route = useCurrentRoute();

  const matchedRoute = Children.toArray(props.children).find((child: ReactNode) => {
    const { match } = (child as any).props;
    return !match || route.startsWith(match);
  }) || null;

  return <>{matchedRoute}</>

}
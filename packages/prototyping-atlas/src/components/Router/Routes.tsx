import { Children, ReactNode } from 'react';
import { useCurrentRoute } from './Router';

interface RoutesProps {

  children: ReactNode;

}

export const Routes = (props: RoutesProps) => {

  const route = useCurrentRoute();

  const findMatching = (): ReactNode | null =>
    Children.toArray(props.children).find((child: ReactNode) => {
      const { match } = (child as any).props;
      return !match || route.startsWith(match);
    }) || null;

  const matchedRoute = findMatching();

  console.log('matching route', matchedRoute);

  return <>{matchedRoute}</>

}
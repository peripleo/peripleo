import { ReactNode } from "react";

interface RouteProps {

  match?: string;

  element: ReactNode;

}

export const Route = (props: RouteProps) => {

  return <>{props.element}</>;

}
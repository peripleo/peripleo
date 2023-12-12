import { ReactNode } from 'react';
import { useCurrentRoute, useNavigate, useParams } from './Router';

interface LinkProps {

  children: ReactNode;

  className?: string;

  to: string;

}

export const Link = (props: LinkProps) => {

  const navigate = useNavigate();

  const onClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    navigate(props.to);
  }

  return (
    <a 
      className={props.className}
      href={`#${props.to}`}
      onClick={onClick}>
      {props.children}
    </a>
  )

}
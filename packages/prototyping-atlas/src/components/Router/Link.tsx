import { ReactNode } from 'react';
import { useNavigate } from './Router';

interface LinkProps {

  children: ReactNode;

  className?: string;

  to: string;

}

export const Link = (props: LinkProps) => {

  const navigate = useNavigate();

  const onClick = (evt: React.MouseEvent) => {
    // This prevents normal link navigation, and instead
    // makes sure 'navigate' gets called to retain params
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
import './ThreeDots.css';

interface ThreeDotsProps {

  className?: string;

}

export const ThreeDots = (props: ThreeDotsProps) => {

  const className = `${props.className || ''} loader three-dots`.trim();

  return (
    <span className={className}></span>
  )

}
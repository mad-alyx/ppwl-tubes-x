import React from 'react';
interface XlogoProps {
  className?: string;
}
const Xlogo = ({ className = "h-12 w-12" }: XlogoProps) => {
  return (
    <img src="/img/rola/eX.jpeg" className={className} alt="eX logo" />
  );
};
export default Xlogo;
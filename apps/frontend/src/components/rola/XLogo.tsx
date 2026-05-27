import React from 'react';
interface XLogoProps {
  className?: string;
}
const XLogo = ({ className = "h-12 w-12" }: XLogoProps) => {
  return (
    <img src="/img/rola/eX.jpeg" className={className} alt="eX logo" />
  );
};
export default XLogo;
import Link, { LinkProps } from 'next/link';
import React, { PropsWithChildren } from 'react';

type PaginationLinkProps = PropsWithChildren<LinkProps> & {
  className?: string;
};

const PaginationLink: React.FC<PaginationLinkProps> = (props) => (
  <Link
    {...props}
    className={`
      ${props?.className || ''} 
      hover:underline
      `}
  />
);

export default PaginationLink;

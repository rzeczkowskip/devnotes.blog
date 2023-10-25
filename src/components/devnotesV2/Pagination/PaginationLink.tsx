import Link, { LinkProps } from 'next/link';
import React, { PropsWithChildren } from 'react';
import cn from '@/helpers/cn';

type PaginationLinkProps = PropsWithChildren<LinkProps> & {
  className?: string;
};

const PaginationLink: React.FC<PaginationLinkProps> = (props) => (
  <Link {...props} className={cn('hover:underline', props?.className)} />
);

export default PaginationLink;

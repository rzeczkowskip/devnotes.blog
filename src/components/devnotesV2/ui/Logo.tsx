import Link from 'next/link';
import React from 'react';
import LogoImage from '@assets/logo.svg';

type LogoProps = {
  title: string;
  href: string;
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ title = '', href = '/', className }) => (
  <Link
    href={href}
    title={title}
    className={`flex items-center text-black no-underline ${className || ''}`}
  >
    <LogoImage className="mr-3 h-full w-auto" />
    <span>{title}</span>
  </Link>
);

export default Logo;

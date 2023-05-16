'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NavToggle from './NavToggle';
import useOnClickOutside from '@/hooks/useOnClickOutside';
import { NavLink } from '@/types/SiteConfig';

type NavProps = {
  items: NavLink[]
};
const Nav: React.FC<NavProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const ref = useOnClickOutside(closeNav);
  const pathname = usePathname();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(closeNav, [pathname]);

  return (
    <nav className="flex items-center" ref={ ref }>
      <NavToggle toggle={ toggleNav } className="lg:hidden" />

      <div className={ `
        font-semibold
        flex flex-col
        lg:justify-end lg:items-center
        lg:static lg:w-auto lg:drop-shadow-none lg:translate-x-0
        lg:flex-row lg:p-0
        fixed bottom-0 top-0 right-0 z-40
        px-4 py-6
        w-72 max-w-full
        drop-shadow
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        bg-white lg:bg-transparent
        transition-transform duration-300 ease-in-out
        h-screen lg:h-auto
      ` }>

        <NavToggle toggle={ toggleNav } isOpen={ true } className="lg:hidden ml-auto mr-0 mb-4" />

        { items.map(({ label, url }) => (
          <Link
            key={ url }
            href={ url }
            className={ `block p-4 hover:underline hover:text-lead-500 ${pathname === url ? 'underline' : ''}` }
          >
            { label }
          </Link>
        )) }
      </div>
    </nav>
  );
};

export default Nav;

import { Bars3BottomRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';

type NavToggleProps = {
  toggle: () => void,
  isOpen?: boolean,
  className?: string,
};

const NavToggle: React.FC<NavToggleProps> = ({ className, toggle, isOpen = false }) => (
  <button className={ className } onClick={ toggle }>
    { isOpen ? (<XMarkIcon className="w-8 h-8" />) : (<Bars3BottomRightIcon className="w-8 h-8" />) }
  </button>
);

export default NavToggle;

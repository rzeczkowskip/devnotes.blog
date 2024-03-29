import React, { PropsWithChildren } from 'react';
import cn from '@/helpers/cn';

type ColoredTextProps = PropsWithChildren;

const ColoredText: React.FC<ColoredTextProps> = ({ children }) => (
  <span
    className={cn(
      'bg-clip-text text-fill-transparent bg-gradient-to-r from-lead-800 to-lead-500',
    )}
  >
    {children}
  </span>
);

export default ColoredText;

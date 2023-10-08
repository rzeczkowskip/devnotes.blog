import React, { PropsWithChildren } from 'react';

type ColoredTextProps = PropsWithChildren;

const ColoredText: React.FC<ColoredTextProps> = ({ children }) => (
  <span
    className={
      'bg-clip-text text-fill-transparent bg-gradient-to-r from-lead-800 to-lead-500'
    }
  >
    {children}
  </span>
);

export default ColoredText;

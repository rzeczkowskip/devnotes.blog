import React, { PropsWithChildren } from 'react';
import ColoredText from '@/components/ColoredText';

type ColoredTitleProps = PropsWithChildren<{
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  size?: 'small' | 'regular' | 'big';
}>;

const ColoredTitle: React.FC<ColoredTitleProps> = ({
  children,
  className,
  as: Component = 'div',
  size = 'regular',
}) => (
  <Component
    className={`
    font-extrabold tracking-wide leading-tight text-lead-800
    ${size === 'regular' ? 'text-3xl md:text-4xl' : ''} 
    ${size === 'small' ? 'text-xl md:text-2xl' : ''} 
    ${size === 'big' ? 'text-3xl md:text-4xl lg:text-6xl' : ''} 
    ${className || ''}
  `}
  >
    <ColoredText>{children}</ColoredText>
  </Component>
);

export default ColoredTitle;

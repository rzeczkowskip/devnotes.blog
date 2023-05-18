import React, { PropsWithChildren } from 'react';
import ColoredText from '@/components/ColoredText';

type ColoredTitleProps = PropsWithChildren<{
  className?: string,
  as?: keyof React.JSX.IntrinsicElements,
}>;

const ColoredTitle: React.FC<ColoredTitleProps> = ({
  children,
  className,
  as: Component = 'div',
}) => (
  <Component className={ `font-extrabold tracking-wide text-3xl md:text-4xl lg:text-6xl leading-tight md:leading-tight lg:leading-tight text-lead-800 ${className || ''}` }>
    <ColoredText>{ children }</ColoredText>
  </Component>
);

export default ColoredTitle;

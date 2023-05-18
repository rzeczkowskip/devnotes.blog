import React, { PropsWithChildren } from 'react';
import ColoredTitle from '@/components/ColoredTitle/ColoredTitle';

type TitleProps = PropsWithChildren<{
  tag?: 'h1' | 'h2' | 'h3',
}>;

const Title: React.FC<TitleProps> = (
  { children, tag = 'h2' },
) => (<ColoredTitle as={ tag } className="mb-12 lg:text-4xl">{ children }</ColoredTitle>);

export default Title;

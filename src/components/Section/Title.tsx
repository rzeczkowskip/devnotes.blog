import React, { PropsWithChildren } from 'react';

type TitleProps = PropsWithChildren<{
  tag?: 'h1' | 'h2' | 'h3',
}>;

const Title: React.FC<TitleProps> = (
  { children, tag: TitleTag = 'h2' },
) => (<TitleTag className="font-extrabold text-2xl mb-7">{ children }</TitleTag>);

export default Title;

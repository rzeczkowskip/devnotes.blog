import React, { PropsWithChildren } from 'react';
import ColoredText from '@/components/devnotesV2/ColoredText';

type TitleProps = PropsWithChildren<{
  tag?: 'h1' | 'h2' | 'h3';
}>;

const Title: React.FC<TitleProps> = ({ children, tag: Tag = 'h2' }) => (
  <Tag className="mb-12">
    <ColoredText>{children}</ColoredText>
  </Tag>
);

export default Title;

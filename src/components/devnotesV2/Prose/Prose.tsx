import React, { PropsWithChildren } from 'react';

type ProseContainerProps = PropsWithChildren<{
  className?: string;
  fullWidth?: boolean;
  as?: 'div' | 'article';
}>;

const Prose: React.FC<ProseContainerProps> = ({
  as: ContainerTag = 'article',
  children,
  className,
  fullWidth = true,
}) => (
  <ContainerTag
    className={`prose prose-slate mx-auto ${fullWidth ? 'max-w-none' : ''} ${
      className || ''
    } `}
  >
    {children}
  </ContainerTag>
);

export default Prose;

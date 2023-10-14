import React, { PropsWithChildren } from 'react';

type ProseContainerProps = PropsWithChildren<{
  className?: string;
  fullWidth?: boolean;
  as?: 'div' | 'article';
}>;

const Prose: React.FC<ProseContainerProps> = ({
  as: ContainerTag = 'div',
  children,
  className,
}) => (
  <ContainerTag className={`prose prose-slate ${className || ''} `}>
    {children}
  </ContainerTag>
);

export default Prose;

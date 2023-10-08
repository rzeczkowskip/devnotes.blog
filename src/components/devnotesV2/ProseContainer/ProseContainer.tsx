import React, { PropsWithChildren } from 'react';

type ProseContainerProps = PropsWithChildren<{
  className?: string;
}>;

const ProseContainer: React.FC<ProseContainerProps> = ({
  children,
  className,
}) => (
  <div className={`w-full container-prose mx-auto ${className || ''} `}>
    {children}
  </div>
);

export default ProseContainer;

import React, { PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren & {
  size?: 'small' | 'regular' | 'full';
  className?: string;
};

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'small',
}) => (
  <div
    className={`
    ${size === 'small' ? 'container lg:container-lg' : ''} 
    ${size === 'regular' ? 'container' : ''} 
    mx-auto px-4 ${className}
    `}
  >
    {children}
  </div>
);

export default Container;

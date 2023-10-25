import React, { PropsWithChildren } from 'react';
import cn from '@/helpers/cn';

type ContainerProps = PropsWithChildren;

const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className={cn('container-lg mx-auto px-4')}>{children}</div>
);

export default Container;

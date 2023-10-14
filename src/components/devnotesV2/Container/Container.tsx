import React, { PropsWithChildren } from 'react';
import className from '@/helpers/className';

type ContainerProps = PropsWithChildren;

const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className={className('container-lg mx-auto px-4')}>{children}</div>
);

export default Container;

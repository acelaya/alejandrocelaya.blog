import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren<{ className?: string }>;

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div className={clsx('container mx-auto p-3', className)}>
    {children}
  </div>
);

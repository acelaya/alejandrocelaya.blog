import type { FC, PropsWithChildren } from 'react';
import classNames from 'classnames';

type ContainerProps = PropsWithChildren<{ className?: string }>;

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div className={classNames('container mx-auto p-3', className)}>
    {children}
  </div>
);

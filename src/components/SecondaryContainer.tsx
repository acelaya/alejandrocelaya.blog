import { clsx } from 'clsx';
import type { FC, PropsWithChildren } from 'react';
import { Container } from './Container';

export const SecondaryContainer: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={clsx('bg-gray-50 py-10', className)}>
    <Container>
      {children}
    </Container>
  </div>
);

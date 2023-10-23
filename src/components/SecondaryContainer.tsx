import type { FC, PropsWithChildren } from 'react';
import { Container } from './Container';

export const SecondaryContainer: FC<PropsWithChildren> = ({ children }) => (
  <div className="bg-gray-50 py-10">
    <Container>
      {children}
    </Container>
  </div>
);

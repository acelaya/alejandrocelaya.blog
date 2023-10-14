import { FC, PropsWithChildren } from 'react';

export const SecondaryContainer: FC<PropsWithChildren> = ({ children }) => (
  <div id="fh5co-subscribe">
    <div className="container">
      {children}
    </div>
  </div>
);

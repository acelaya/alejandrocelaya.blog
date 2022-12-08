import { FC, PropsWithChildren } from 'react';

type ContainerProps = PropsWithChildren<{ className?: string }>;

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div id="fh5co-faqs">
    <div className={`container ${className ?? ''}`}>
      {children}
    </div>
  </div>
);

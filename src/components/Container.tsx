import { FC } from 'react';

export const Container: FC<{ className?: string }> = ({ children, className }) => (
  <div id="fh5co-faqs">
    <div className={`container ${className ?? ''}`}>
      {children}
    </div>
  </div>
);

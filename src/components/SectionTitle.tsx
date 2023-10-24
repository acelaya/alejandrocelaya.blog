import type { FC, PropsWithChildren } from 'react';

type SectionTitleProps = PropsWithChildren<{
  className?: string;
}>;

export const SectionTitle: FC<SectionTitleProps> = ({ children, className }) => (
  <header>
    <h2 className={className}>{children}</h2>
  </header>
);

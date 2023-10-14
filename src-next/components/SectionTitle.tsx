import { FC, PropsWithChildren } from 'react';
import { CarbonAds } from './CarbonAds';

type SectionTitleProps = PropsWithChildren<{
  className?: string;
}>;

export const SectionTitle: FC<SectionTitleProps> = ({ children, className }) => (
  <header className="clearfix">
    <CarbonAds />
    <h2 className={className}>{children}</h2>
  </header>
);

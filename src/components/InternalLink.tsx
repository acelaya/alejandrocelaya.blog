import type { FC } from 'react';
import type { LinkProps } from './Link';

const InternalLink: FC<LinkProps> = ({ children, className, ...rest }) => (
  <a {...rest} className={className}>{children}</a>
);

export default InternalLink;

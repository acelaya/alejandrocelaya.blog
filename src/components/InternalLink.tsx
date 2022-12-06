import React, { FC } from 'react';
import Link from 'next/link';
import { LinkProps } from './Link';

const InternalLink: FC<LinkProps> = ({ children, className, ...rest }) => (
  <Link {...rest} className={className}>{children}</Link>
);

export default InternalLink;

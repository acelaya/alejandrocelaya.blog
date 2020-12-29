import React, { FC } from 'react';
import Link from 'next/link';
import { ExternalLinkProps } from 'react-external-link/dist/ExternalLink';

const InternalLink: FC<ExternalLinkProps> = ({ children, className, ...rest }) => (
  <Link {...rest}>
    <a className={className}>{children}</a>
  </Link>
);

export default InternalLink;

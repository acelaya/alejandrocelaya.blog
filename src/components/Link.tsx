import React, { FC, ReactNode } from 'react';
import { ExternalLink } from 'react-external-link';
import InternalLink from './InternalLink';

export interface LinkProps {
  href: string;
  children?: ReactNode;
  [rest: string]: any;
}

const Link: FC<LinkProps> = (props) => {
  const { href } = props;
  const Component = href?.startsWith('http') ? ExternalLink : InternalLink;

  return <Component {...props} />;
};

export default Link;

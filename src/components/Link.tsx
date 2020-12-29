import React, { FC } from 'react';
import { ExternalLink } from 'react-external-link';
import { ExternalLinkProps } from 'react-external-link/dist/ExternalLink';
import InternalLink from './InternalLink';

const Link: FC<ExternalLinkProps> = (props) => {
  const { href } = props;
  const Component = href?.startsWith('http') ? ExternalLink : InternalLink;

  return <Component {...props} />;
};

export default Link;

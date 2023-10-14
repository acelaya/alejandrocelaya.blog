import type { FC, PropsWithChildren } from 'react';
import { ExternalLink } from 'react-external-link';
import InternalLink from './InternalLink';

export interface LinkProps extends PropsWithChildren {
  href: string;
  [rest: string]: any;
}

const Link: FC<LinkProps> = (props) => {
  const { href } = props;
  const Component = href?.startsWith('http') ? ExternalLink : InternalLink;

  return <Component {...props} />;
};

export default Link;

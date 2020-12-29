import { ComponentType, FC, PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';
import Highlight from 'react-highlight';
import { WithPostProps } from '../types';
import { MDXProvider } from '@mdx-js/react';
import Link from '../Link';
import * as React from 'react';

const components = {
  code: (props: any) => <Highlight {...props} />,
  a: (props: any) => <Link {...props} />,
}

interface PostContentProps extends WithPostProps {
  wrapper?: ComponentType<PropsWithChildren<any>>;
}

export const PostContent: FC<PostContentProps> = ({ post, wrapper }) => {
  const Content = dynamic(() => import(`../../posts/${post.fileName}`));

  return (
    <MDXProvider components={{ ...components, wrapper }}>
      <Content />
    </MDXProvider>
  );
};

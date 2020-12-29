import { ComponentType, FC, PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';
import { mdxComponents } from '../../utils/mdx';
import { WithPostProps } from '../types';
import { MDXProvider } from '@mdx-js/react';
import * as React from 'react';

interface PostContentProps extends WithPostProps {
  wrapper?: ComponentType<PropsWithChildren<any>>;
}

export const PostContent: FC<PostContentProps> = ({ post, wrapper }) => {
  const Content = dynamic(() => import(`../../posts/${post.fileName}`));

  return (
    <MDXProvider components={{ ...mdxComponents, wrapper }}>
      <Content />
    </MDXProvider>
  );
};

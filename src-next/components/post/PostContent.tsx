import { FC } from 'react';
import dynamic from 'next/dynamic';
import { mdxComponents } from '../../utils/mdx';
import { WithPostProps } from '../types';
import * as React from 'react';

export const PostContent: FC<WithPostProps> = ({ post }) => {
  const Content = dynamic(() => import(`../../posts/${post.fileName}`)) as any;
  return <Content components={mdxComponents} />;
};

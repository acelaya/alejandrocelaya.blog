import { FC } from 'react';
import { WithPostProps } from '../types';
import { CarbonAds } from '../CarbonAds';
import { PostHeading } from './PostHeading';
import { PostContent } from './PostContent';

export const PostDetail: FC<WithPostProps> = ({ post }) => (
  <div>
    <PostHeading post={post} />
    <CarbonAds />
    <PostContent post={post} />
  </div>
);

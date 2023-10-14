import { FC } from 'react';
import { WithPostProps } from '../types';
import { CarbonAds } from '../CarbonAds';
import { OldPostBanner } from './OldPostBanner';
import { PostHeading } from './PostHeading';
import { PostContent } from './PostContent';

export const PostDetail: FC<WithPostProps> = ({ post }) => (
  <div>
    <PostHeading post={post} />
    <OldPostBanner post={post} />
    <CarbonAds />
    <PostContent post={post} />
  </div>
);

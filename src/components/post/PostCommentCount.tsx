import type { FC } from 'react';
import { CommentCount } from 'disqus-react';
import { disqusPropsForPost } from '../../utils/disqus';
import type { WithPostProps } from '../types';

export const PostCommentCount: FC<WithPostProps> = ({ post }) => (
  <CommentCount {...disqusPropsForPost(post.data.title, post.url)}>Comments</CommentCount>
);

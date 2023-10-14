import type { FC } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { disqusPropsForPost } from '../../utils/disqus';
import type { WithPostProps } from '../types';

export const PostComments: FC<WithPostProps> = ({ post }) => (
  <DiscussionEmbed {...disqusPropsForPost(post.data.title, post.url)} />
);

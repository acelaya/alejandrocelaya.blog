import { FC } from 'react';
import { DiscussionEmbed } from 'disqus-react';
import { disqusPropsForPost } from '../../utils/disqus';
import { WithPostProps } from '../types';

export const PostComments: FC<WithPostProps> = ({ post }) => <DiscussionEmbed {...disqusPropsForPost(post)} />;

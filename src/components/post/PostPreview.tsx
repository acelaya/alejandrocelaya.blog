import { Children, FC } from 'react';
import { WithPostProps } from '../types';
import { PostContent } from './PostContent';

const wrapper = ({ children }) => <>{Children.toArray(children).slice(0, 5)}</>

export const PostPreview: FC<WithPostProps> = ({ post }) => <PostContent post={post} wrapper={wrapper} />;

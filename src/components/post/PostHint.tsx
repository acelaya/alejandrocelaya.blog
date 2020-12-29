import { FC, Children, ReactElement } from 'react';
import { WithPostProps } from '../types';
import Link from '../Link';
import { PostContent } from './PostContent';

const wrapper = ({ children }) => (
<>
  {Children.toArray(children).filter((child) => {
    if (typeof child !== 'object') {
      return false;
    }

    return (child as ReactElement).props?.originalType === 'p';
  }).slice(0, 2)}
</>
)

export const PostHint: FC<WithPostProps> = ({ post }) => (
  <article>
    <dl>
      <dt className="entry-title"><Link href={post.url ?? ''} rel="bookmark">{post.title}</Link></dt>
      <dd className="entry-summary">
        <PostContent post={post} wrapper={wrapper} />
      </dd>
    </dl>
  </article>
);

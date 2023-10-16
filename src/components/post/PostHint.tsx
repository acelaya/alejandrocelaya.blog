import type { FC } from 'react';
import type { Post } from '../../utils/posts';
import Link from '../Link';

export interface PostHintProps {
  post: Post;
}

export const PostHint: FC<PostHintProps> = ({ post }) => (
  <article>
    <dl>
      <dt className="entry-title">
        <Link href={post.url} rel="bookmark">{post.data.title}</Link>
      </dt>
      <dd className="entry-summary">
        <p>{post.excerpt}</p>
      </dd>
    </dl>
  </article>
);

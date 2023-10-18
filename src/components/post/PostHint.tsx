import type { FC } from 'react';
import type { SimplePost } from '../../utils/posts';
import Link from '../Link';

export type PostHintProps = Pick<SimplePost, 'url' | 'title' | 'excerpt'>

export const PostHint: FC<PostHintProps> = ({ url, title, excerpt }) => (
  <article>
    <dl>
      <dt className="entry-title">
        <Link href={url} rel="bookmark">{title}</Link>
      </dt>
      <dd className="entry-summary">
        <p>{excerpt}</p>
      </dd>
    </dl>
  </article>
);

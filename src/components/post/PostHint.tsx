import { FC } from 'react';
import { WithPostProps } from '../types';
import Link from '../Link';
import { usePostSummary } from '../../hooks/use-post-summary';

export const PostHint: FC<WithPostProps> = ({ post }) => {
  const summary = usePostSummary(post);
  return (
    <article>
      <dl>
        <dt className="entry-title"><Link href={post.url ?? ''} rel="bookmark">{post.title}</Link></dt>
        <dd className="entry-summary">
          <p>{summary}</p>
        </dd>
      </dl>
    </article>
  );
};

import { FC } from 'react';
import { WithPostProps } from '../types';
import Link from '../Link';
import { usePostSummary } from '../../hooks/use-post-summary';

export const PostPreview: FC<WithPostProps> = ({ post }) => {
  const summary = usePostSummary(post);
  return (
    <div style={{ marginBottom: '10px' }}>
      <p>{summary}</p>
      <div>
        <Link href={post.url}><b>Continue reading...</b></Link>
      </div>
    </div>
  );
};

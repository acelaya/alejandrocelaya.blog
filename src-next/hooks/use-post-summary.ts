import { Post } from '../utils/posts';
import { useEffect, useState } from 'react';

export const usePostSummary = (post: Post): string => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    import(`../posts/${post.fileName}`).then(({ summary }) => setSummary(summary));
  }, []);

  return summary;
}

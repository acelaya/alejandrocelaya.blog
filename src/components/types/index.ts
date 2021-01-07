import { Post } from '../../utils/posts';

export type TaxonomiesType = 'categories' | 'tags';

export type TaxonomyType = 'category' | 'tag';

export interface WithPostProps {
  post: Post;
}

export interface WithLatestPosts {
  latestPosts: Post[];
}

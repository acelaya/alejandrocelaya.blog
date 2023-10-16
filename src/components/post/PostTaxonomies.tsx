import type { FC } from 'react';
import type { WithPostProps } from '../types';
import { PostTaxonomy } from './PostTaxonomy';

const Categories: FC<{ categories: string[] }> = ({ categories }) => (
  <li className="categories-list">
    {categories.map((category, index) => (
      <PostTaxonomy
        key={category}
        type="category"
        value={category}
        appendSpace={index < categories.length - 1}
      />
    ))}
  </li>
)

const Tags: FC<{ tags: string[] }> = ({ tags }) => (
  <li className="tags-list">
    {tags.map((tag, index) => (
      <PostTaxonomy
        key={tag}
        type="tag"
        value={tag}
        appendSpace={index < tags.length - 1}
      />
    ))}
  </li>
);

export const PostTaxonomies: FC<WithPostProps> = ({ post }) => (
  <ul className="list-unstyled">
    {post.data.categories.length > 0 && <Categories categories={post.data.categories} />}
    {post.data.tags.length > 0 && <Tags tags={post.data.tags} />}
    <li className="clearfix" />
  </ul>
)

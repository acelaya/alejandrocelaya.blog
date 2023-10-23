import type { FC } from 'react';
import type { WithPostProps } from '../types';
import { PostTaxonomy } from './PostTaxonomy';

const Categories: FC<{ categories: string[] }> = ({ categories }) => (
  <ul className="flex space-x-1 justify-center">
    {categories.map((category) => (
      <li key={category}>
        <PostTaxonomy type="category" value={category} />
      </li>
    ))}
  </ul>
)

const Tags: FC<{ tags: string[] }> = ({ tags }) => (
  <ul className="flex space-x-1 justify-center">
    {tags.map((tag) => (
      <li key={tag}>
        <PostTaxonomy type="tag" value={tag} />
      </li>
    ))}
  </ul>
);

export const PostTaxonomies: FC<WithPostProps> = ({ post }) => (
  <div className="md:flex space-y-2 justify-between">
    <Categories categories={post.data.categories} />
    <Tags tags={post.data.tags} />
  </div>
)

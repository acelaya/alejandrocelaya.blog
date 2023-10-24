import { clsx } from 'clsx';
import type { FC } from 'react';
import type { TaxonomyType, WithPostProps } from '../types';
import { PostTaxonomy } from './PostTaxonomy';

const Taxonomies: FC<{ taxonomies: string[]; type: TaxonomyType }> = ({ taxonomies, type }) => (
  <ul className={clsx('flex flex-wrap space-x-1 justify-center', {
    'md:justify-end': type === 'tag',
    'md:justify-start': type === 'category',
  })}>
    {taxonomies.map((taxonomy) => (
      <li key={taxonomy}>
        <PostTaxonomy type={type} value={taxonomy} />
      </li>
    ))}
  </ul>
);

export const PostTaxonomies: FC<WithPostProps> = ({ post }) => (
  <div className="md:flex space-y-2 md:space-y-0 justify-between">
    <Taxonomies type="category" taxonomies={post.data.categories} />
    <Taxonomies type="tag" taxonomies={post.data.tags} />
  </div>
)

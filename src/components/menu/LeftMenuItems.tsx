import type { FC } from 'react';
import type { Categories } from '../../utils/posts';
import { humanFriendlyCategory } from '../../utils/posts';
import Link from '../Link';

export type LeftMenuItemsProps = {
    categories: Categories;
};

export const LeftMenuItems: FC<LeftMenuItemsProps> = ({ categories }) => (
  <>
    <li><Link href="/">Home</Link></li>
    {categories.map((category) => (
      <li key={category}><Link href={`/category/${category}/`}>{humanFriendlyCategory(category)}</Link></li>
    ))}
  </>
);

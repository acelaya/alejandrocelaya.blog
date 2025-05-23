import { clsx } from 'clsx';
import type { FC } from 'react';
import type { TaxonomyType } from '../types';
import Link from '../Link';

interface TaxonomyProps {
  type: TaxonomyType;
  value: string;
  appendSpace?: boolean;
}

export const PostTaxonomy: FC<TaxonomyProps> = ({ type, appendSpace, value }) => (
  <>
    <Link
      className={clsx('px-2 py-1 rounded-sm text-white hover:text-white font-bold text-xs', {
        'bg-primary dark:text-grey-dark': type === 'tag',
        'bg-grey-dark dark:bg-grey': type === 'category',
      })}
      href={`/${type}/${encodeURI(value)}/`}
    >
      {value.replace(/-/g, ' ')}
    </Link>
    {appendSpace && <>&nbsp;</>}
  </>
);

import classNames from 'classnames';
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
      className={classNames('px-2 py-1 rounded text-white hover:text-white font-bold text-xs', {
        'bg-primary': type === 'tag',
        'bg-grey-dark': type === 'category',
      })}
      href={`/${type}/${encodeURI(value)}/`}
    >
      {value.replace(/-/g, ' ')}
    </Link>
    {appendSpace && <>&nbsp;</>}
  </>
);

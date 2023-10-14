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
    <Link className={`label label-${type}`} href={`/${type}/${encodeURI(value)}`}>
      {value.replace(/-/g, ' ')}
    </Link>
    {appendSpace && <>&nbsp;</>}
  </>
);

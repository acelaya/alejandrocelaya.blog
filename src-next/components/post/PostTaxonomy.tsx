import { FC, Fragment } from 'react';
import { TaxonomyType } from '../types';
import Link from '../Link';

interface TaxonomyProps {
  type: TaxonomyType;
  value: string;
  appendSpace?: boolean;
}

export const PostTaxonomy: FC<TaxonomyProps> = ({ type, appendSpace, value }) => (
  <Fragment>
    <Link className={`label label-${type}`} href={`/${type}/${encodeURI(value)}`}>
      {value.replace(/-/g, ' ')}
    </Link>
    {appendSpace && <>&nbsp;</>}
  </Fragment>
);

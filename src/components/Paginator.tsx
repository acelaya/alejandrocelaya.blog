import type { FC, PropsWithChildren } from 'react';
import Link from './Link';
import classNames from 'classnames';

interface WithBasePath {
  basePath?: string;
}

export interface PaginatorProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
}

const itemClasses = 'px-3 py-1 border rounded-full';

type ItemType = 'next' | 'prev';

const Next: FC = () => <>&larr; Older posts</>;

const Prev: FC = () => <>Newer posts &rarr;</>;

const EnabledItem: FC<{ href: string; type: ItemType }> = ({ href, type }) => (
  <Link href={href} className={classNames(itemClasses, 'hover:bg-gray-100 transition')}>
    {type === 'prev' && <Prev />}
    {type === 'next' && <Next />}
  </Link>
);

const DisabledItem: FC<{ type: ItemType }> = ({ type }) => (
  <span className={classNames(itemClasses, 'text-gray-400 cursor-not-allowed')}>
    {type === 'prev' && <Prev />}
    {type === 'next' && <Next />}
  </span>
);

export const Paginator: FC<PaginatorProps & WithBasePath> = (
  { isLastPage, isFirstPage, currentPage, basePath = '' },
) => (
  <div className="w-full flex justify-between">
    {!isLastPage && <EnabledItem type="next" href={`${basePath}/page/${currentPage + 1}/`} />}
    {isLastPage && <DisabledItem type="next" />}
    {!isFirstPage && <EnabledItem type="prev" href={`${basePath}/page/${currentPage - 1}/`} />}
    {isFirstPage && <DisabledItem type="prev" />}
  </div>
);

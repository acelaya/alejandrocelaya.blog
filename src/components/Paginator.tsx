import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { clsx } from 'clsx';
import type { FC } from 'react';
import Link from './Link';

interface WithBasePath {
  basePath?: string;
}

export interface PaginatorProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
}

const itemClasses = 'px-3 py-1 border dark:border-grey-light rounded-full';

type ItemType = 'next' | 'prev';

const Next: FC = () => <><FontAwesomeIcon icon={faArrowLeft} /> Older posts</>;

const Prev: FC = () => <>Newer posts <FontAwesomeIcon icon={faArrowRight} /></>;

const EnabledItem: FC<{ href: string; type: ItemType }> = ({ href, type }) => (
  <Link href={href} className={clsx(itemClasses, 'hover:bg-gray-100 hover:dark:bg-grey-darker transition')}>
    {type === 'prev' && <Prev />}
    {type === 'next' && <Next />}
  </Link>
);

const DisabledItem: FC<{ type: ItemType }> = ({ type }) => (
  <span className={clsx(itemClasses, 'text-gray-400 cursor-not-allowed')}>
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

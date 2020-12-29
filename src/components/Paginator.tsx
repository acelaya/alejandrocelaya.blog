import { FC } from 'react';
import Link from './Link';

interface WithBasePath {
  basePath?: string;
}

export interface PaginatorProps {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
}

export const Paginator: FC<PaginatorProps & WithBasePath> = (
  { isLastPage, isFirstPage, currentPage, basePath = '' },
) => (
  <ul className="pager">
    <li className={`previous ${isLastPage ? 'disabled' : ''}`}>
      {!isLastPage && <Link href={`${basePath}/page/${currentPage + 1}`}>&larr; Older posts</Link>}
      {isLastPage && <span>&larr; Older posts</span>}
    </li>
    <li className={`next ${isFirstPage ? 'disabled' : ''}`}>
      {!isFirstPage && <Link href={`${basePath}/page/${currentPage - 1}`}>Newer posts &rarr;</Link>}
      {isFirstPage && <span>Newer posts &rarr;</span>}
    </li>
  </ul>
);

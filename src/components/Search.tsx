import type { FC } from 'react';
import type { SimplePost } from '../utils/posts.ts';
import { useCallback, useMemo, useState } from 'react';
import { PostHint } from './post/PostHint.tsx';
import Fuse from 'fuse.js';

export interface SearchProps {
  posts: SimplePost[];
}

const loadSearchFromQueryParams = () => {
  const { search } = window.location;
  const params = new URLSearchParams(search);

  return params.get('q') ?? '';
};

const updateSearchInQueryParams = (newSearchValue: string) => {
  const params = new URLSearchParams();
  params.set('q', newSearchValue);

  window.history.replaceState(null, '', `?${params.toString()}`);
};

export const Search: FC<SearchProps> = ({ posts }) => {
  const [searchValue, setSearchValue] = useState<string>(loadSearchFromQueryParams);
  const updateSearch = useCallback((newSearchValue: string) => {
    setSearchValue(newSearchValue);
    updateSearchInQueryParams(newSearchValue);
  }, []);
  const fuse = useMemo(() => new Fuse(posts, { keys: ['body', 'title'],
  }), [posts])
  const results = useMemo(() => fuse.search(searchValue), [fuse, searchValue]);

  return (
    <>
      <section>
        <input
          type="search"
          name="q"
          placeholder="Search…"
          aria-label="Search"
          autoComplete="off"
          className="form-control"
          value={searchValue}
          onChange={(e) => updateSearch(e.target.value)}
        />
      </section>

      <section>
        <div className="hfeed">
          {results.length === 0 && (
            <>
              {searchValue === '' && <p className="text-center">Enter a search term in the field above</p>}
              {searchValue !== '' && <p className="text-center">No results found</p>}
            </>
          )}
          {results.map(({ item: post }, index) => (
            <PostHint key={index} url={post.url} title={post.title} excerpt={post.excerpt} />
          ))}
        </div>
      </section>
    </>
  );
}

import type { FC } from 'react';
import type { Post } from '../utils/posts.ts';
import { useCallback, useState } from 'react';
import { useLunr } from 'react-lunr';
import { PostHint } from './post/PostHint.tsx';

export interface SearchProps {
  index: object;
  posts: Record<string, Post>;
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

export const Search: FC<SearchProps> = ({ index, posts }) => {
  const [searchValue, setSearchValue] = useState<string>(loadSearchFromQueryParams);
  const updateSearch = useCallback((newSearchValue: string) => {
    setSearchValue(newSearchValue);
    updateSearchInQueryParams(newSearchValue);
  }, []);
  const results = useLunr(searchValue, index, posts);

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
          {results.map((post, index) => <PostHint key={index} post={post as Post} />)}
        </div>
      </section>
    </>
  );
}

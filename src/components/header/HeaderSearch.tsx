import type { FC } from 'react';
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { clsx } from 'clsx';

export const HeaderSearch: FC<{ className?: string }> = ({ className }) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [q, setQuery] = useState('');

  return (
    <div className="-mt-2 -mx-2 relative">
      <input
        type="search"
        className={clsx(
          'md:absolute right-0 rounded p-2 md:pr-9 outline-0',
          'w-full md:w-0 md:opacity-0 md:focus:w-80 focus:opacity-100 transition-appear',
        )}
        placeholder="Search…"
        aria-label="Search"
        ref={ref}
        value={q}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onKeyDown={(e) => {
          if (q && e.key === 'Enter') {
            window.location.href = `/search/?q=${q}`;
          }
        }}
      />
      <button
        tabIndex={-1}
        className="absolute right-2 top-2"
        onClick={() => ref.current?.focus()}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className={clsx(className, 'hidden md:inline', { '!text-grey': inputFocused })}
        />
      </button>
    </div>
  );
};

import type { FC } from 'react';
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const HeaderSearch: FC = () => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [iconClass, setIconClass] = useState<'focus' | ''>('');
  const [q, setQuery] = useState('');

  return (
    <div className="header-search">
      <input
        type="search"
        className="form-control"
        placeholder="Search"
        ref={ref}
        value={q}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIconClass('focus')}
        onBlur={() => setIconClass('')}
        onKeyPress={(e) => {
          if (q && e.key === 'Enter') {
            window.location.href = `/search/?q=${q}`;
          }
        }}
      />
      <FontAwesomeIcon icon={faSearch} className={`icon-search ${iconClass}`} onClick={() => ref.current?.focus()} />
    </div>
  );
};

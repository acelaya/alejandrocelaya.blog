import { FC, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

export const HeaderSearch: FC = () => {
  const { push } = useRouter();
  const ref = useRef<HTMLInputElement>();
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
          if (q !== '' && e.key === 'Enter') {
            push(`/search/?q=${q}`, undefined, { shallow: true });
          }
        }}
      />
      <FontAwesomeIcon icon={faSearch} className={`icon-search ${iconClass}`} onClick={() => ref.current?.focus()} />
    </div>
  );
};

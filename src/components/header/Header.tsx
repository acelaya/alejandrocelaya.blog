import { faBars, faCode, faRss, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, PropsWithChildren } from 'react';
import { ExternalLink } from 'react-external-link';
import type { Categories } from '../../utils/posts.ts';
import { humanFriendlyCategory } from '../../utils/posts.ts';
import { Container } from '../Container';
import Link from '../Link.tsx';
import { HeaderSearch } from './HeaderSearch.tsx';
import { clsx } from 'clsx';
import { useState } from 'react';

const HeaderList: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <ul className={clsx('flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6', className)}>
    {children}
  </ul>
);

const linkClasses = 'text-white hover:text-white font-medium opacity-70 hover:opacity-100';

export const Header: FC<{ categories: Categories }> = ({ categories }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <button
        onClick={() => setVisible((prev) => !prev)}
        className={clsx('md:hidden fixed right-6 top-4 z-50 text-white')}
      >
        <FontAwesomeIcon icon={visible ? faTimes : faBars} size="xl" className="drop-shadow" />
      </button>
      <section className={clsx('z-40 top-0 transition-[right]', [
        // Default (mobile)
        'fixed w-64 h-screen bg-black p-3',
        // Bigger devices
        'md:absolute md:w-full md:h-auto md:bg-transparent md:p-0 md:pt-8 md:right-0',
      ], {
        '-right-64': !visible,
        'right-0': visible,
      })}>
        <Container className="pb-0 h-full">
          <nav role="navigation" className="flex flex-col md:flex-row justify-between h-full">
            <HeaderList>
              <li><Link className={linkClasses} href="/">Home</Link></li>
              {categories.map((category) => (
                <li key={category}>
                  <Link className={linkClasses} href={`/category/${category}/`}>{humanFriendlyCategory(category)}</Link>
                </li>
              ))}
            </HeaderList>
            <HeaderList>
              <li>
                <HeaderSearch className={linkClasses} />
              </li>
              <li>
                <ExternalLink className={linkClasses} href="/atom.xml">
                  <FontAwesomeIcon fixedWidth icon={faRss} />
                  <span className="ml-2 md:sr-only">RSS feed</span>
                </ExternalLink>
              </li>
              <li>
                <Link className={linkClasses} href="https://www.alejandrocelaya.com">
                  <FontAwesomeIcon fixedWidth icon={faCode} />
                  <span className="ml-2 md:sr-only">About me</span>
                </Link>
              </li>
            </HeaderList>
          </nav>
        </Container>
      </section>
    </>
  );
};

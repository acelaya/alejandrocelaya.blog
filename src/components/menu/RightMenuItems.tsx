import { faCode, faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ExternalLink } from 'react-external-link';
import { FC } from 'react';
import { HeaderSearch } from '../HeaderSearch';
import Link from '../Link';

export const RightMenuItems: FC = () => (
  <>
    <li>
      <HeaderSearch />
    </li>
    <li className="social-element" id="rss">
      <ExternalLink href="/feed/"><FontAwesomeIcon icon={faRss} /></ExternalLink>
    </li>
    <li className="social-element">
      <Link href="https://www.alejandrocelaya.com"><FontAwesomeIcon icon={faCode} /></Link>
    </li>
  </>
);

import { faCode, faRss, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from './Link';
import { ExternalLink } from 'react-external-link';
import { HeaderSearch } from './HeaderSearch';

const Header = () => (
  <section id="fh5co-header">
    <div className="container">
      <nav role="navigation">
        <ul className="pull-left left-menu">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/category/php/">PHP</Link></li>
          <li><Link href="/category/zf/">ZF</Link></li>
          <li><Link href="/category/web/">Web</Link></li>
          <li><Link href="/category/tools/">Tools</Link></li>
          <li><Link href="/category/oss/">OSS</Link></li>
        </ul>
        <ul className="pull-right right-menu header-icons">
          <li>
            <HeaderSearch />
          </li>
          <li className="social-element" id="rss">
            <ExternalLink href="/feed/"><FontAwesomeIcon icon={faRss} /></ExternalLink>
          </li>
          <li className="social-element">
            <Link href="https://www.alejandrocelaya.com"><FontAwesomeIcon icon={faCode} /></Link>
          </li>
        </ul>
      </nav>
    </div>
  </section>
);

export default Header;

import { faGithub, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from './Link';
import { ExternalLink } from 'react-external-link';

const Footer = () => (
  <footer id="fh5co-footer">
    <div className="container">
      <div className="row row-bottom-padded-md">
        <div className="col-md-2 col-xs-12">
          <div className="fh5co-footer-widget">
            <h3>Categories</h3>
            <ul className="fh5co-links">
              <li><Link href="/category/php/">PHP</Link></li>
              <li><Link href="/category/zf/">ZF</Link></li>
              <li><Link href="/category/web/">Web</Link></li>
              <li><Link href="/category/tools/">Tools</Link></li>
              <li><Link href="/category/oss/">OSS</Link></li>
            </ul>
          </div>
        </div>

        <div className="col-md-7 col-xs-12">
          <div className="fh5co-footer-widget">
            <h3>Latest blog posts</h3>
            <ul className="fh5co-links blog-posts">
              {/* TODO Print latest 5 posts here */}
              {/*{% for post in site.posts | slice(0, 5) %}*/}
              {/*<li><a href="{{ site.url }}{{ post.url }}">{{ post.title }}</a></li>*/}
              {/*{% endfor %}*/}
            </ul>
          </div>
        </div>

        <div className="col-md-3 col-xs-12">
          <div className="fh5co-footer-widget">
            <h3>Contents</h3>
            <ul className="fh5co-links">
              <li><Link href="/categories/">Categories</Link></li>
              <li><Link href="/tags/">Tags</Link></li>
            </ul>
          </div>

          <div className="fh5co-footer-widget" style={{ marginTop: '40px' }}>
            <h3>Follow me</h3>
            <ul className="fh5co-social">
              <li>
                <Link href="https://www.linkedin.com/in/alejandro-celaya-alastrue/">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </Link>
              </li>
              <li>
                <Link href="https://github.com/acelaya"><FontAwesomeIcon icon={faGithub} /></Link>
              </li>
              <li>
                <Link href="https://twitter.com/acelayaa"><FontAwesomeIcon icon={faTwitter} /></Link>
              </li>
              <li><ExternalLink href="/feed/"><FontAwesomeIcon icon={faRss} /></ExternalLink></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="fh5co-copyright">
      <div className="container">
        <p className="pull-left">
          <small>
            &copy; {new Date().getFullYear()} <Link href="https://www.alejandrocelaya.com">Alejandro Celaya Alastrué</Link>.
          </small>
        </p>
        <p className="pull-right"><small>Full-stack developer</small></p>
      </div>
    </div>
  </footer>
);

export default Footer;

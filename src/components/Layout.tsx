import Head from 'next/head';
import { FC, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from './Footer';
import Header from './Header';
import { MobileMenu } from './menu/MobileMenu';
import { WithLatestPosts } from './types';

interface LayoutProps extends WithLatestPosts {
  url: string
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, title, url, latestPosts }) => {
  const ref = useRef<HTMLDivElement>();
  const computedTitle = `${process.env.SITE_TITLE} — ${process.env.SITE_SUBTITLE}`;
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  return (
    <>
      <MobileMenu isVisible={mobileMenuVisible} toggle={() => setMobileMenuVisible(!mobileMenuVisible)} />

      <Head>
        <title>{computedTitle}</title>
        <meta name="description" content={computedTitle} />
        <meta name="theme-color" content="#2a2d36" />
        <meta property="og:title" content={title ?? computedTitle} />
        <meta property="og:url" content={`${process.env.SITE_URL}${url}`} />
        <meta property="og:type" content="development" />
        <meta property="og:image" content={`${process.env.SITE_URL}/assets/img/hero_bg.jpg`} />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,600,400italic,700' />
        <link
          rel="alternate"
          type="application/atom+xml"
          href={`${process.env.SITE_URL}/atom.xml`}
          title={`${process.env.SITE_TITLE} activity feed`}
        />
      </Head>

      <div
        id="fh5co-page"
        className={mobileMenuVisible ? 'offcanvas-visible' : ''}
        onClick={() => setMobileMenuVisible(false)}
      >
        <Header />

        <section id="fh5co-hero" className="no-js-fullheight">
          <div className="fh5co-overlay" />
          <div className="container">
            <div className="fh5co-intro no-js-fullheight">
              <div className="fh5co-intro-text">
                <div className={`fh5co-center-position ${title ? 'post-title' : ''}`}>
                  <h2>{title ?? process.env.SITE_TITLE}</h2>
                  {!title && <h3 style={{ margin: 0 }}>{process.env.SITE_SUBTITLE}.</h3>}
                </div>
              </div>
            </div>
          </div>
          <div className="fh5co-learn-more">
            <a href="#" className="scroll-btn" onClick={(e) => {
              e.preventDefault();
              ref.current?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span className="arrow">
                <FontAwesomeIcon icon={faChevronDown} />
              </span>
            </a>
          </div>
        </section>

        <section ref={ref}>
          {children}
        </section>

        <Footer latestPosts={latestPosts} />
      </div>
    </>
  )
};

export default Layout;

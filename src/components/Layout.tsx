import Head from 'next/head';
import { FC, useRef } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  url: string
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, title, url }) => {
  const ref = useRef<HTMLDivElement>();
  const computedTitle = `${process.env.SITE_TITLE} — ${process.env.SITE_SUBTITLE}`;

  return (
    <div>
      <Head>
        <title>{computedTitle}</title>
        <meta name="description" content={computedTitle} />
        <meta name="theme-color" content="#2a2d36" />
        <meta property="og:title" content={title ?? computedTitle} />
        <meta property="og:url" content={`${process.env.SITE_URL}${url}`} />
        <meta property="og:type" content="development" />
        <meta property="og:image" content={`${process.env.SITE_URL}/assets/img/hero_bg.jpg`} />
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,600,400italic,700' />
      </Head>

      <div id="fh5co-page">
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

        <Footer />
      </div>
    </div>
  )
};

export default Layout;

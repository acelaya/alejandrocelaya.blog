import { faGithub, faLinkedinIn, faXTwitter, faMastodon } from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { FC, PropsWithChildren } from 'react';
import { ExternalLink } from 'react-external-link';
import type { Categories, Post } from '../utils/posts';
import { humanFriendlyCategory } from '../utils/posts';
import Link from './Link';
import { SecondaryContainer } from './SecondaryContainer.tsx';
import { Container } from './Container.tsx';

export type FooterProps = {
  latestPosts: Post[];
  categories: Categories;
}

const FooterList: FC<{ title: string; links: [string, string][] }> = ({ title, links }) => (
  <>
    <h3 className="font-normal mb-4">{title}</h3>
    <ul className="space-y-3">
      {links.map(([href, text]) => (
        <li key={href} className="truncate">
          <Link
            href={href}
            className="text-grey-light hover:text-grey-light hover:underline text-sm"
          >
            {text}
          </Link>
        </li>
      ))}
    </ul>
  </>
);

const FollowMe = () => (
  <>
    <h3 className="font-normal mb-4">Follow me</h3>
    <ul className="space-x-4">
      <li className="inline text-md">
        <Link className="text-grey-light" href="https://www.linkedin.com/in/alejandro-celaya-alastrue/">
          <FontAwesomeIcon icon={faLinkedinIn} />
        </Link>
      </li>
      <li className="inline text-md">
        <Link className="text-grey-light" href="https://github.com/acelaya">
          <FontAwesomeIcon icon={faGithub} />
        </Link>
      </li>
      <li className="inline text-md">
        <Link className="text-grey-light" href="https://mastodon.social/@acelaya" rel="me">
          <FontAwesomeIcon icon={faMastodon} />
        </Link>
      </li>
      <li className="inline text-md">
        <Link className="text-grey-light" href="https://x.com/acelayaa">
          <FontAwesomeIcon icon={faXTwitter} />
        </Link>
      </li>
      <li className="inline text-md">
        <ExternalLink className="text-grey-light" href="/atom.xml">
          <FontAwesomeIcon icon={faRss} />
        </ExternalLink>
      </li>
    </ul>
  </>
);

const Footer: FC<FooterProps> = ({ latestPosts, categories }) => (
  <footer className="mt-4">
    <SecondaryContainer>
      <div className="flex flex-col md:flex-row space-y-6 md:space-x-4 md:space-y-0">
        <div className="w-full md:w-1/6">
          <FooterList
            title="Categories"
            links={categories.map((category) => [`/category/${category}/`, humanFriendlyCategory(category)])}
          />
        </div>

        <div className="w-full md:w-7/12">
          <FooterList
            title="Latest blog posts"
            links={latestPosts.map((post) => [post.url, post.data.title])}
          />
        </div>

        <div className="w-full md:w-2/6">
          <FooterList title="Contents" links={[['/categories/', 'Categories'], ['/tags/', 'Tags']]} />

          <div className="mt-6 md:mt-10">
            <FollowMe />
          </div>
        </div>
      </div>
    </SecondaryContainer>

    <Container className="py-8 flex flex-col md:flex-row items-center md:justify-between">
      <p className="text-sm">
        &copy;{`${new Date().getFullYear()} `}
        <Link className="text-grey-light hover:text-grey-light hover:underline font-bold" href="https://www.alejandrocelaya.com">
          Alejandro Celaya Alastrué
        </Link>
      </p>
      <p className="text-sm">Full-stack developer</p>
    </Container>
  </footer>
);

export default Footer;

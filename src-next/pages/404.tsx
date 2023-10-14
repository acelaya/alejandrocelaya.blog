import { FC } from 'react';
import Layout from '../components/Layout'
import Link from '../components/Link';
import { Container } from '../components/Container';
import { WithLatestPosts } from '../components/types';
import { withStaticLatestPosts } from '../utils/pages';

const NotFoundPage: FC<WithLatestPosts> = ({ latestPosts }) => {
  return (
    <Layout latestPosts={latestPosts} url="/" title="404. Page not found">
      <Container>
        <div className="text-center" style={{ margin: '5rem 0' }}>
          <h3 style={{ lineHeight: '40px' }}>
            The page you requested could not be found. Use your browser's Back button to navigate to the page you
            have previously come from or just press this button.
          </h3>
          <Link className="btn btn-primary btn-lg" href="/">Home </Link>
        </div>
      </Container>
    </Layout>
  )
};

export const getStaticProps = withStaticLatestPosts(async () => ({ props: {} }));

export default NotFoundPage;

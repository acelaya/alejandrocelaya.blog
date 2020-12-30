import { GetStaticProps } from 'next';
import { FC } from 'react';
import Layout from '../components/Layout'
import Link from '../components/Link';
import { getPostsForPage, Post } from '../utils/posts';
import { Container } from '../components/Container';

interface NotFoundPageProps {
  latestPosts: Post[];
}

const NotFoundPage: FC<NotFoundPageProps> = ({ latestPosts }) => {
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

export const getStaticProps: GetStaticProps<NotFoundPageProps> = async () => {
  const { posts: latestPosts } = await getPostsForPage();

  return {
    props: { latestPosts },
  };
};

export default NotFoundPage;

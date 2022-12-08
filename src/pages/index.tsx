import { FC } from 'react';
import Layout from '../components/Layout'
import { getPostsForPage, Post } from '../utils/posts';
import { CarbonAds } from '../components/CarbonAds';
import { PostPreview } from '../components/post/PostPreview';
import { PostTaxonomies } from '../components/post/PostTaxonomies';
import { PostHeading } from '../components/post/PostHeading';
import { Container } from '../components/Container';
import Link from '../components/Link';
import { Paginator, PaginatorProps } from '../components/Paginator';
import { withStaticLatestPosts } from '../utils/pages';
import { WithLatestPosts } from '../components/types';

interface HomeProps extends PaginatorProps {
  posts: Post[];
}

const Home: FC<HomeProps & WithLatestPosts> = ({ posts, latestPosts, isFirstPage, isLastPage, currentPage }) => {
  return (
    <Layout latestPosts={latestPosts} url="/">
      <Container>
        <ul className="fh5co-faq-list">
          {posts.map((post, index) => (
            <li key={post.slug} className="post">
              <h2 className="post-title"><Link href={post.url}>{post.title}</Link></h2>
              <PostHeading post={post} />
              {index === 0 && <CarbonAds />}
              <PostPreview post={post} />
              <PostTaxonomies post={post} />
            </li>
          ))}
        </ul>

        <div>
          <hr />
          <Paginator isFirstPage={isFirstPage} isLastPage={isLastPage} currentPage={currentPage} />
        </div>
      </Container>
    </Layout>
  )
};

export const getStaticProps = withStaticLatestPosts<HomeProps>(async (context) => {
  const page: number = Number(context.params?.pageNum ?? 1);
  const result = await getPostsForPage({ page });

  return {
    props: {
      ...result,
      currentPage: page,
    },
  };
});

export default Home;

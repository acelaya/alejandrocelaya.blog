import { GetStaticProps } from 'next';
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

interface HomeProps extends PaginatorProps {
  posts: Post[];
  latestPosts: Post[];
}

const Home: FC<HomeProps> = ({ posts, latestPosts, isFirstPage, isLastPage, currentPage }) => {
  return (
    <Layout latestPosts={latestPosts} url="/">
      <Container>
        <ul className="fh5co-faq-list">
          {posts.map((post, index) => (
            <li key={post.slug} className="post">
              <h2 className="post-title"><Link href={post.url}>{post.title}</Link></h2>
              <PostHeading post={post} />
              <div>
                {index === 0 && <CarbonAds />}
                <PostPreview post={post} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Link href={post.url}><b>Continue reading...</b></Link>
              </div>
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

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  const page: number = Number(context.params?.pageNum ?? 1);
  const [result, { posts: latestPosts }] = await Promise.all([
    getPostsForPage(page),
    getPostsForPage(1),
  ]);

  return {
    props: {
      ...result,
      latestPosts,
      currentPage: page,
    },
  };
};

export default Home;

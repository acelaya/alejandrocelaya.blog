import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../components/Layout';
import { getPostsForPage, listPosts, Post } from '../utils/posts';
import { PostDetail } from '../components/post/PostDetail';
import { PostTaxonomies } from '../components/post/PostTaxonomies';
import { SecondaryContainer } from '../components/SecondaryContainer';
import { Container } from '../components/Container';
import { PostSocialSharing } from '../components/post/PostSocialSharing';
import { PostComments } from '../components/post/PostComments';
import Link from '../components/Link';

interface PostDetailProps {
  post: Post;
  prevPost: Post | null;
  nextPost: Post | null;
  latestPosts: Post[];
}

const PostDetailPage: FC<PostDetailProps> = ({ post, nextPost, prevPost, latestPosts }) => {
  return (
    <Layout title={post.title} url={post.url} latestPosts={latestPosts}>
      <Container>
        <article className="post post-detail">
          <PostDetail post={post} />

          <div className="share">
            <br />
            <hr />
            <PostSocialSharing post={post} />
          </div>

          <div>
            <hr />
            <PostTaxonomies post={post} />
          </div>
        </article>
      </Container>

      <SecondaryContainer>
        <ul className="list-unstyled other-articles row">
          <li className="col-sm-6 col-xs-12 article-next">
            {prevPost && (
              <Link className="previous" href={prevPost.url}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <span className="title">{prevPost.title}</span>
              </Link>
            )}
          </li>
          <li className="col-sm-6 col-xs-12 article-prior">
            {nextPost && (
              <Link className="next" href={nextPost.url}>
                <span className="title">{nextPost.title}</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            )}
          </li>
        </ul>
      </SecondaryContainer>

      <Container>
        <PostComments post={post} />
      </Container>
    </Layout>
  )
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await listPosts();

  return {
    paths: posts.map(({ date, slug }) => ({
      params: { slug: [ ...date.split('-'), slug ] }
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostDetailProps> = async (context) => {
  const [,,, slug] = (context.params?.slug ?? []) as string[];
  const [posts, { posts: latestPosts }] = await Promise.all([
    listPosts(),
    getPostsForPage(1),
  ]);
  const post = posts.find((post) => post.slug === slug)
  const indexOfPost = posts.indexOf(post);
  const prevPost = posts[indexOfPost + 1] ?? null;
  const nextPost = posts[indexOfPost - 1] ?? null;

  return {
    props: {
      post,
      prevPost,
      nextPost,
      latestPosts,
    },
  };
};

export default PostDetailPage;

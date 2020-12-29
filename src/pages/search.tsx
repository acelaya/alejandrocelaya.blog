import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import lunr from 'lunr';
import { useLunr } from 'react-lunr';
import Layout from '../components/Layout';
import { Container } from '../components/Container';
import { getPostsForPage, listPosts, Post } from '../utils/posts';
import { SectionTitle } from '../components/SectionTitle';
import { PostHint } from '../components/post/PostHint';

interface SearchPageProps {
  index: object;
  posts: Record<string, Post>;
  latestPosts: Post[];
}

const SearchPage: FC<SearchPageProps> = ({ index, posts, latestPosts }) => {
  const { query: { q = '' } } = useRouter()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const results = useLunr(searchQuery, index, posts) as Post[];

  useEffect(() => {
    setSearchQuery(`${q}`);
  }, [q]);

  return (
    <Layout url="/search/" latestPosts={latestPosts}>
      <Container className="search-section">
        <SectionTitle>Search</SectionTitle>

        <section>
          <input
            type="search"
            name="q"
            placeholder="Search"
            autoComplete="off"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>

        <section>
          <div className="hfeed">
            {results.length === 0 && searchQuery !== '' && <p className="text-center">No results found</p>}
            {results.map((post, index) => <PostHint key={index} post={post} />)}
          </div>
        </section>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<SearchPageProps> = async () => {
  const [posts, { posts: latestPosts }] = await Promise.all([
    listPosts(),
    getPostsForPage(),
  ]);
  const index = lunr(function () {
    this.field('title');
    this.field('content');

    posts.forEach((post) => this.add({
      id: post.slug,
      ...post,
    }));
  })

  return {
    props: {
      index: index.toJSON(),
      posts: posts.reduce((acc, post) => {
        acc[post.slug] = post;
        return acc;
      }, {}),
      latestPosts,
    },
  };
};

export default SearchPage;

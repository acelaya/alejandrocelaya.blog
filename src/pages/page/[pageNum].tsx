import { GetStaticPaths } from 'next';
import { calcPagesForPosts, listPosts } from '../../utils/posts';
import { range } from 'ramda';

export { default, getStaticProps } from '../index';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await listPosts();
  const pages = range(1, calcPagesForPosts(posts) + 1);

  return {
    paths: pages.map((page) => ({
      params: { pageNum: `${page}` }
    })),
    fallback: false,
  };
};

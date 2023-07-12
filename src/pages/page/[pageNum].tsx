import { GetStaticPaths } from 'next';
import { calcPagesForPosts, listPosts } from '../../utils/posts';

export { default, getStaticProps } from '../index';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await listPosts();
  const totalPages = calcPagesForPosts(posts);
  const paths = [];

  for (let page = 1; page <= totalPages; page++) {
    paths.push({
      params: { pageNum: `${page}` }
    });
  }

  return {
    paths,
    fallback: false,
  };
};

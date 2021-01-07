import { calcPagesForPosts, getPostsForPage, listPosts, listTaxonomies } from './posts';
import { GetStaticPaths, GetStaticProps } from 'next';
import { TaxonomiesPageProps } from '../components/pages/TaxonomiesPage';
import { TaxonomiesType, TaxonomyType, WithLatestPosts } from '../components/types';
import { TaxonomyPageProps } from '../components/pages/TaxonomyPage';
import { range } from 'ramda';

const TAXONOMY_PAGE_SIZE = 10;

export const getStaticPropsForTaxonomies = (type: TaxonomiesType) => withStaticLatestPosts<TaxonomiesPageProps>(
  async () => {
    const taxonomies = await listTaxonomies(type);

    return {
      props: { taxonomies, type },
    };
  }
);

export const getStaticPropsForTaxonomy = (type: TaxonomyType) => withStaticLatestPosts<TaxonomyPageProps>(
  async (context) => {
    const page = Number(context.params?.pageNum ?? 1);
    const taxonomy = String(context.params?.taxonomy ?? '');
    const result = await getPostsForPage({ page, pageSize: TAXONOMY_PAGE_SIZE, [type]: taxonomy });

    return {
      props: {
        ...result,
        type,
        taxonomy,
        currentPage: page,
      },
    };
  }
);

export const getStaticPathsForTaxonomy = (type: TaxonomiesType): GetStaticPaths => async () => {
  const taxonomies = await listTaxonomies(type);

  const pathsByTaxonomy = await Promise.all(taxonomies.map(async (taxonomy) => {
    const posts = await (type === 'categories' ? listPosts(taxonomy) : listPosts(undefined, taxonomy));
    const pages = range(1, calcPagesForPosts(posts, TAXONOMY_PAGE_SIZE) + 1);

    return pages.map((page) => ({
      params: { taxonomy, pageNum: `${page}` }
    }));
  }))

  return {
    paths: pathsByTaxonomy.flat(),
    fallback: false,
  };
};

export const withStaticLatestPosts = <T>(wrapped: GetStaticProps<T>): GetStaticProps<T & WithLatestPosts> =>
  async (ctx) => {
    const [{ props = {} }, { posts: latestPosts }] = await Promise.all([
      wrapped(ctx) as any,
      getPostsForPage()
    ]);

    return {
      props: {
        ...props,
        latestPosts,
      }
    };
  };

import { calcPagesForPosts, getPostsForPage, listPosts, listTaxonomies } from './posts';
import { GetStaticPaths, GetStaticProps } from 'next';
import { TaxonomiesPageProps } from '../components/pages/TaxonomiesPage';
import { TaxonomiesType, TaxonomyType } from '../components/types';
import { TaxonomyPageProps } from '../components/pages/TaxonomyPage';
import { range } from 'ramda';

export const getStaticPropsForTaxonomies = (type: TaxonomiesType): GetStaticProps<TaxonomiesPageProps> => async () => {
  const taxonomies = await listTaxonomies(type);

  return {
    props: { taxonomies, type },
  };
};

export const getStaticPropsForTaxonomy = (type: TaxonomyType): GetStaticProps<TaxonomyPageProps> => async (context) => {
  const page = Number(context.params?.pageNum ?? 1);
  const taxonomy = String(context.params?.taxonomy ?? '');
  const result = await (
    type === 'category' ? getPostsForPage(page, taxonomy) : getPostsForPage(page, undefined, taxonomy)
  );

  return {
    props: {
      ...result,
      type,
      taxonomy,
      currentPage: page,
    },
  };
};

export const getStaticPathsForTaxonomy = (type: TaxonomiesType): GetStaticPaths => async () => {
  const taxonomies = await listTaxonomies(type);

  const pathsByTaxonomy = await Promise.all(taxonomies.map(async (taxonomy) => {
    const posts = await (type === 'categories' ? listPosts(taxonomy) : listPosts(undefined, taxonomy));
    const pages = range(1, calcPagesForPosts(posts) + 1);

    return pages.map((page) => ({
      params: { taxonomy, pageNum: `${page}` }
    }));
  }))

  return {
    paths: pathsByTaxonomy.flat(),
    fallback: false,
  };
};

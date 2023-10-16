import { getCollection, z } from 'astro:content';
import { format, parse } from 'date-fns';
import { decode } from 'html-entities';
import MarkdownIt from 'markdown-it';
import type { TaxonomiesType } from '../components/types';

export const PAGE_SIZE = 5;
export const SUB_PAGE_SIZE = 10;

export const postMetaSchema = z.object({
  title: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string())
})

export type PostMeta = z.infer<typeof postMetaSchema>;

export interface Post {
  id: string;
  body: string;
  excerpt: string;
  slug: string;
  url: string;
  date: string;
  formattedDate: string;
  data: PostMeta;
}

const parser = new MarkdownIt();
const postExcerpt = (body: string) => {
  const excerpt = parser
    .render(body)
    .split('\n')
    // Remove HTML tags
    .flatMap((str) => str.replace(/<\/?[^>]+(>|$)/g, '').split('\n'))
    // Decode HTML entities into their actual character
    .map((str) => decode(str))
    // Filter out MDX imports
    .filter((line) => !line.startsWith('import '))
    // Get only first 6 paragraphs
    .slice(0, 6)
    .join(' ')
    // Truncate to 300 characters
    .substring(0, 300);

  return `${excerpt}…`;
}

export const getAllPosts = () => getCollection('posts').then(
  (posts) => posts.reverse().map(
    ({ slug, ...rest }) => {
      const [year, month, day, ...restOfSlug] = slug.split('-');
      const url = `/${year}/${month}/${day}/${restOfSlug.join('-')}/`;
      const date = `${year}-${month}-${day}`;
      const formattedDate = format(parse(date, 'y-M-d', new Date()), 'dd MMMM y');
      const excerpt = postExcerpt(rest.body);

      return {
        slug,
        url,
        date,
        formattedDate,
        excerpt,
        ...rest,
      };
    },
  ),
);

export const getLatestPosts = async () => {
  const posts = await getAllPosts();
  return posts.slice(0, PAGE_SIZE);
};

const getTaxonomiesFactory = (taxonomy: TaxonomiesType) => async (): Promise<string[]> => {
  const posts = await getAllPosts();
  return [...new Set(posts.flatMap(({ data }) => data[taxonomy]))].sort();
};

export const getCategories = getTaxonomiesFactory('categories');

export const getTags = getTaxonomiesFactory('tags');

export type PostFilter = { category: string } | { tag: string };

export const filteredPosts = async (filter: PostFilter) => {
  const posts = await getAllPosts();
  return posts.filter((post) => {
    if ('category' in filter) {
      return post.data.categories.includes(filter.category);
    }

    return post.data.tags.includes(filter.tag);
  });
};

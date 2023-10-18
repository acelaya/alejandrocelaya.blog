import { getCollection, z } from 'astro:content';
import { format, parse } from 'date-fns';
import { decode } from 'html-entities';
import { renderMarkdown } from './markdown';

export const PAGE_SIZE = 5;
export const SUB_PAGE_SIZE = 10;

const categories = ['web', 'php', 'tools', 'oss'] as const;

export type Categories = typeof categories;

type CategoryType = Categories[number];

const capitalize = <T extends string>(value: T): string => {
  const [firstLetter, ...rest] = value;
  return `${firstLetter.toUpperCase()}${rest.join('')}`;
};

export const humanFriendlyCategory = (category: CategoryType): string => {
  return ['web', 'tools'].includes(category) ? capitalize(category) : category.toUpperCase();
};

export const postMetaSchema = z.object({
  title: z.string(),
  categories: z.array(z.enum(categories)),
  tags: z.array(z.string()),
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

export type SimplePost = Pick<Post, 'body' | 'excerpt' | 'url'> & {
  title: string;
}

const postExcerpt = (body: string) => {
  const excerpt = renderMarkdown(body)
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

export const getAllPosts = (): Promise<Post[]> => getCollection('posts').then(
  (posts) => [...posts].reverse().map(
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

export const getCategories = () => categories;

export const getTags = async (): Promise<string[]> => {
  const posts = await getAllPosts();
  return [...new Set(posts.flatMap(({ data }) => data.tags))].sort();
};

export type PostFilter = { category: CategoryType } | { tag: string };

export const filteredPosts = async (filter: PostFilter) => {
  const posts = await getAllPosts();
  return posts.filter((post) => {
    if ('category' in filter) {
      return post.data.categories.includes(filter.category);
    }

    return post.data.tags.includes(filter.tag);
  });
};

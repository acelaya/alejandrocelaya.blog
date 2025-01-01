import { z } from 'zod';

export const PAGE_SIZE = 5;
export const SUB_PAGE_SIZE = 10;

const categories = ['web', 'php', 'tools', 'oss'] as const;

export type Categories = typeof categories;

export type CategoryType = Categories[number];

export const getCategories = () => categories;

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

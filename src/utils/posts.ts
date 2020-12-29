import fs from 'fs';
import path from 'path'
import { format, parse } from 'date-fns';
import { TaxonomiesType } from '../components/types';

const POSTS_DIR = path.join(process.cwd(), 'src/posts')
const PAGE_SIZE = 5;

export interface PostMeta {
  title: string;
  categories: string[];
  tags: string[];
}

export interface Post extends PostMeta {
  slug: string;
  date: string;
  formattedDate: string;
  fileName: string;
  url: string;
  content: string;
}

interface PostsPagination {
  posts: Post[];
  isFirstPage: boolean;
  isLastPage: boolean;
}

const renderPost = async (postFileName: string): Promise<string> => {
  return fs.readFileSync(path.join(process.cwd(), 'src/posts', postFileName)).toString();
}

const filterByCategoryOrTag = (category?: string, tag?: string) => (post: Post) => {
  if (category) {
    return post.categories.includes(category);
  }

  if (tag) {
    return post.tags.includes(tag);
  }

  return true;
};

export const listPosts = async (category?: string, tag?: string): Promise<Post[]> => {
  const fileNames = fs.readdirSync(POSTS_DIR)
  const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
    // Remove ".md" from file name to get id
    const [year, month, day, ...rest] = fileName.split('-');
    const slug = rest.join('-').replace(/\.mdx$/, '');
    const url = `/${year}/${month}/${day}/${slug}/`;
    const date = `${year}-${month}-${day}`;
    const formattedDate = format(parse(date, 'y-M-d', new Date()), 'dd MMMM y');

    const [{ metadata = {} }, content] = await Promise.all([
      import(`../posts/${fileName}`),
      renderPost(fileName)
    ]);

    // Combine the data with the id
    return { slug, date, formattedDate, fileName, url, content, ...metadata }
  }))

  // Filter posts by category or tag and sort by date
  return allPostsData.filter(filterByCategoryOrTag(category, tag)).sort((a, b) =>  a.date < b.date ? 1 : -1)
};

export const calcPagesForPosts = (posts: Post[]) => Math.ceil(posts.length / PAGE_SIZE);

export const getPostsForPage = async (page: number, category?: string, tag?: string): Promise<PostsPagination> => {
  const allPosts = await listPosts(category, tag);
  const posts = allPosts.slice(page * PAGE_SIZE - PAGE_SIZE, page * PAGE_SIZE);

  return {
    posts,
    isFirstPage: page === 1,
    isLastPage: page >= calcPagesForPosts(allPosts),
  }
}

export const listTaxonomies = async (prop: TaxonomiesType): Promise<string[]> => {
  const posts = await listPosts();
  const taxonomies = posts.map((post) => post[prop]).flat();

  return [ ...new Set(taxonomies) ].sort((a, b) => a < b ? -1 : 1);
}

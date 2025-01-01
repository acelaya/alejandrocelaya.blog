import rss from '@astrojs/rss';
import { parseISO } from 'date-fns';
import { config } from '../../config/config';
import { getAllPosts } from '../utils/posts-content.ts';
import { renderMarkdown } from '../utils/markdown';

export async function GET() {
  const posts = await getAllPosts();
  const toPlainMarkdownBody = (body: string) => body
    .split('\n')
    // Remove MDX import lines
    .filter((line) => !line.startsWith('import '))
    .join('\n');

  return rss({
    title: config.SITE_TITLE,
    description: config.SITE_SUBTITLE,
    site: config.SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      link: post.url,
      pubDate: parseISO(post.date),
      description: post.data.title,
      content: renderMarkdown(toPlainMarkdownBody(post.body))
    })),
  });
}

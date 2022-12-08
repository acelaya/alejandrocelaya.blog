import fs from 'fs';
import path from 'path';
import { parse } from 'date-fns';
import { Feed } from 'feed';
import { listPosts } from './posts';
import { config } from '../../config/config.mjs';

const { SITE_URL, SITE_TITLE } = config;

export const generateFeed = async () => {
  const feed = new Feed({
    id: SITE_URL,
    title: SITE_TITLE,
    link: SITE_URL,
    feed: `${SITE_URL}/feed/`,
    updated: new Date(),
    author: {
      name: 'Alejandro Celaya',
      email: 'alejandro@alejandrocelaya.com',
      link: 'https://www.alejandrocelaya.com',
    },
    copyright: '', // Why is this mandatory in the type definition ¯\_(ツ)_/¯
  });

  const posts = await listPosts();

  posts.slice(0, 10).forEach((post) => {
    const fullUrl = `${SITE_URL}${post.url}`;

    feed.addItem({
      id: fullUrl,
      link: fullUrl,
      title: post.title,
      date: parse(post.date, 'y-M-d', new Date()),
      content: post.content,
    });
  });

  fs.writeFileSync(path.join(process.cwd(), 'public/atom.xml'), feed.atom1());
};

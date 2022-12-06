import fs from 'fs';
import path from 'path';
import { parse } from 'date-fns';
import { Feed } from 'feed';
import { listPosts } from '../src/utils/posts'
import { config } from '../config/config.mjs';

const { SITE_URL, SITE_TITLE } = config;

(async () => {
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

  fs.writeFileSync(path.join(process.cwd(), 'out/atom.xml'), feed.atom1());
})();

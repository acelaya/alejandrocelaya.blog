import { Post } from './posts';

export const disqusPropsForPost = (post: Post) => ({
  shortname: process.env.DISQUS_SHORTNAME,
  config: {
    url: `${process.env.SITE_URL}${post.url}`,
    title: post.title,
  },
});

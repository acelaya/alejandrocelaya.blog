import { config } from '../../config/config';


export const disqusPropsForPost = (title: string, url: string) => ({
  shortname: config.DISQUS_SHORTNAME,
  config: {
    url: `${config.SITE_URL}${url}`,
    title,
  },
});

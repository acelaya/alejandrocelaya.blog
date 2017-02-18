---
layout: post
title: Migrating from Wordpress to Sculpin
categories:
    - php
    - tools
tags:
    - wordpress
    - sculpin
    - blog
    - blogging
    - symfony
    - composer

---

Some time ago, on January 2014, I decided to start writing a blog.

Seemed like a good idea. I might be able to show my skills and learn new ones at the same time.

I didn't wanted to use a very complex tool for this purpose, or to create one of my own (why to reinvent the wheel?), so I decided that blogger or wordpress could be the right options.

After weighing the pros and cons of both options I opted for wordpress, because it seemed more customizable, and having a [VPS](https://en.wikipedia.org/wiki/Virtual_private_server) could ease the self-hosting task.

At the begining it was a good solution, but finally proved to be hard to control. Not easy to customize the layout, very resource consuming, hard to optimize, etc.

I looked for alternatives and found an interesting one without all the previous problems, [Sculpin](https://sculpin.io/).

We discussed the tool in the [Symfony Zaragoza](https://twitter.com/symfony_zgz) group, and I really loved it from the begining.

### First approach to Sculpin

In the Github era, many static site generators have appeared, because Github allows us to host static sites for free. Those generators allows us to make a "dynamic" website which is compiled into a static site.

There are many alternatives. From [Jekyll](https://jekyllrb.com/), the Github official static site generator written in ruby, to [Pelican](http://blog.getpelican.com/), another python-powered alternative.

The problem is that I'm a PHP developer, and I'm not as confortable with those languages as I am with PHP, so I looked for a PHP alternative and Sculpin appeared.

Sculpin uses Symfony components, and is fully integrated with composer. I like both tools so I finally decided to use it.

<span class="text-muted">For more information about how to use Sculpin, it has a very good [documentation](https://sculpin.io/getstarted/).</span>

### Migrating from Wordpress

There was a few features in wordpress that I didn't wanted to loose and are not easy to implement in a static site, like comments, built-in search and RSS feed. I also didn't wanted to loose the already indexed content, so I needed to keep the old URLs, at least those pointing to the articles.

Luckily for me, there is a [Sculpin Blog Skeleton](https://github.com/sculpin/sculpin-blog-skeleton) in github with many of the work already done. It includes an atom feed that is refreshed every time you compile your site.

To get comments in my static blog, I have used [disqus](https://disqus.com/). It uses a very easy javascript api to host your comments which are associated to the article's unique URL. Also, they allow to import comments from wordpress, so I could also keep the old comments.

There are other platforms like this, but they don't look as good as disqus.

The built-in search was one of the hardest features to implement. I have used [lunr.js](http://lunrjs.com/), a javascript full text search engine, but I was not sure how to deal with it, so I finally found a Sculpin blog using it, and copy-pasted the needed code. Thanks to [Andrew Shell](http://blog.andrewshell.com) for his code.

After this I just needed to get the articles from wordpress.

Sculpin uses [twig](http://twig.sensiolabs.org/) templates and/or [markdown](http://es.wikipedia.org/wiki/Markdown) to write articles, so it's easy to copy-paste html documents on them. That's what I did. A little customization and done.

Keeping the URLs was easy, because I was using the y/m/d/foobar form in wordpress, and the Sculpin skeleton uses that format by default.

Finally I was considering to host the blog in Github, but I decided to use my VPS, to use some htaccess tricks, like some rewrite rules in order to redirect old URLs to new ones and set a customized 404 page.

The result is the blog you are now seeing.

### Conclusion

My conclusion is that a dynamically generate static site is a good solution for a personal blog. It loads superfast, is very SEO friendly and is easily customizable, but it has an important problem. **Only advanced users can use it**.

The lack of [WYSIWYG](https://es.wikipedia.org/wiki/WYSIWYG) editor makes users with no experience on HTML/Markdown (at least) impossible to deal with this kind of sites.

Also, the site needs to be deployed every time a new article is written.

Apart from that, as I said, It's a good solution, and Sculpin is a really good tool. If you are curious, you can see the pre-compiled version of this blog in github, [here](https://github.com/acelaya/blog).

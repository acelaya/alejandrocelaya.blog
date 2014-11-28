---
title: File uploads with Zend Framework 2 and jQuery
draft: true
categories:
    - zf2
    - web
tags:
    - zf2
    - zend-framework-2
    - jquery
    - file-uploads
    - ajax
    - html5

---

We are all very used to file uploads in plenty of web applications. From simple image uploads to a social network to multiple file uploads to file management applications like Dropbox.

On this article I'm going to explain how to handle asynchronous multifile uploads from a jQuery powered front-end to a Zend Framework 2 back-end, including HTML5 upload progress and file validation (type, size, and such).
 
### Installing example project

I have created a project which is fully functional. I'm going to use it across this article so feel free to clone it from here [https://github.com/acelaya-blog/file-uploads](https://github.com/acelaya-blog/file-uploads).

<blockquote>
    <small>Notice that I've simplified the usual project structure. It's enough for this example, but maybe difficult to maintain if your project grows, so better use the <a href="https://github.com/zendframework/ZendSkeletonApplication">Skeleton Application</a> structure in real applications.</small>
</blockquote>

Once you have it, open a terminal, go to the directory and run `php composer.phar selfupdate && php composer.phar install`.

Finally start the PHP built-in web server by running `cd public && php -S localhost:8000`. Access to <a target="_blank" href="http://localhost:8000">localhost:8000</a> in order to see the application. 
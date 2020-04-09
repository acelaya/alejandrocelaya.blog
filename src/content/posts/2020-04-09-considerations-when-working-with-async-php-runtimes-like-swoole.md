---
layout: post
title: "Considerations when working with async PHP runtimes like swoole"
categories: [php]
tags: [swoole,async,db,cache,scope,autoloading,database]
---

Asynchronous and non-blocking runtimes are pretty usual in many programming languages, as well as long-lived web apps that stay in memory and are capable of dispatching multiple HTTP requests without having to be fully bootstrapped every time. This has not been traditionally the case with PHP apps. 

However, many projects are starting to get some adoption, that bring this long-lived approach to the PHP world.

The problem with this is that PHP developers are not used to this, and they tend to continue acting as they have always done. Also, libraries might have made some assumptions, making them not work as expected when used under this context.

Some of these projects are [swoole](https://www.swoole.co.uk), [ReactPHP](https://reactphp.org/) or [Amphp](https://amphp.org/), to give some examples.

In this article, I will be focusing on the first one, and explain how to approach some of the pain points I have found after using it for a year and a half on an [existing PHP project](https://github.com/shlinkio/shlink).

### Introducing Swoole

The main difference swoole has compared to other similar projects is that it's written as a native PHP extension, and needs to be installed with `pear`.

This is obviously a bit cumbersome, but the benefit is that, since it's written in C++, it has a better handling of memory allocation, which is very important to achieve what it tries to do.

What swoole does is running a main process which bootstraps the PHP application once, and then keeps it in memory so that it can continue dispatching requests without having to load resources every time. This makes it really fast.

Those HTTP requests are handled by a set of child processes called "web workers". Swoole forks the contents in memory for the main process to each one of the workers, so each worker has a "copy" of the application in memory.

Each worker is independent, but each one of them can only handle one request at a time, so you have to increase the number of workers if you expect a lot of concurrent traffic (more on this later).

Other than web workers, swoole also has another set of child processes called "task workers", which can be used to delegate long tasks at runtime to prevent web workers from getting blocked.

Here you can see a diagram of swoole's architecture.

![How Swoole works](https://www.swoole.co.uk/images/how-swoole-works.png)

> More information can be found in [Swoole's website](https://www.swoole.co.uk/how-it-works).

### Problems to solve

Now that we know how swoole works, let's see some of the challanges I have faced in th past, which are usually not that ovbious when you are used to think in terms of "blocking" and "short-lived".

#### Database connections are kept open

One of the first things you find out is that, since the application stays in memory, any database connection that has been opened by a worker (either web or task worker), will be kept open and reused in subsequent executions or HTTP requests served by the app.

This, which is in theory good, has a side effect, which is not obvious during development: **the opened connection will eventually expire**.

Since most of the popular database abstraction layers in PHP are coming from the times in which PHP was just a bootstrap-on-every-request technology, they never cared too much about expired database connections, as they would be opened again on next request.

However, when using swoole and the like, you have to implement some mechanism which takes care of reconnecting or gracefully recovering when this happens.

> I wrote an article explaining how I solved this on a middleware-based app served with swoole and using doctrine: [How to properly handle a doctrine entity manager on an expressive application served with swoole](/2019/11/04/how-to-properly-handle-a-doctrine-entity-manager-on-an-expressive-application-served-with-swoole/)

Obviously, swoole (and also others) provides some tools to work with databases (like this [MySQL client](https://www.swoole.co.uk/docs/modules/swoole-async-mysql-client)), which I'm sure do not have this problem (although, I haven't personally tried this), but they are more limited than other well adopted libraries.

#### In-memory caches don't behave as expected

It is frequent to use local in-memory caches, like APCu

> Notice that this problem does not happen when using distributed/centralized caching solutions, like redis or memcached, as in that case, the caching technology is shared by all workers.




More articles:

* https://www.zend.com/blog/why-you-should-use-asynchronous-php
* https://samsonasik.wordpress.com/2020/04/05/using-swoole-in-mezzio-application-with-sdebug/


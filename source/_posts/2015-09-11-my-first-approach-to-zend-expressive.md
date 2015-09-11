---
title: My first approach to Zend Expressive 
tags:
    - microframework
    - middleware
    - psr-7
    - zend-expressive
categories:
    - php

---

One of the trending topics in the PHP world nowadays is the one about microframeworks. It started some years ago with [Slim](http://www.slimframework.com/) and [Silex](http://silex.sensiolabs.org/), but recently it has been an explossion of new microframeworks.

First, Slim's team announced the third version of its own framework, which implemented the psr-7 HTTP standard by taking advantage of the middleware concept. The previos version works with Middleware too, but psr-7 looks to be designed to be used with middleware.

Then, Laravel launched the [Lumen](http://lumen.laravel.com/) project, which is another microframework based on Laravel components, similar to Silex, which is based on Symfony components.

And finally, Zend framework's team launched [Zend Expressive](https://github.com/zendframework/zend-expressive), which is similar to Slim 3 in the fact that it works with middleware and psr-7, built on top of [zend-stratigility](https://github.com/zendframework/zend-stratigility) and [zend-diactoros](https://github.com/zendframework/zend-diactoros).

Recently, after playing with Slim 3 and Zend Expressive, I decided to use the last one to rebuild the backend of my website, which used to be a ZF2 application.

### Why microframeworks

I have said several times that composer has completely changed PHP. Now it is possible to access to any package or component in any application, which is a really big advantage. You don't have to stick to certain framework's implementation if there is another one that you like better.

That's made possible to start working with a framework that doesn't have a solution for everything, and your poroject can still scale thanks to the fact that composer gives you access to almost anything.

There is where microframeworks have their power.

Also, having in mind that every time more and more packages depend on common abstractions (like the psr abstractions, psr-3 or psr-7, or the new [container interop](https://github.com/container-interop/container-interop)), those small frameworks can work with many existing components.

### Why Zend Expressive

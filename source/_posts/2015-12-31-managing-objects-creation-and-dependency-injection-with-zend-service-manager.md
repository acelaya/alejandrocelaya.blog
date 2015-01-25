---
title: Managing objects creation and dependency injection with Zend\ServiceManager
draft: true
categories:
    - php
    - tools
tags:
    - zf2
    - zend-framework-2
    - zf2-component
    - dependency-injection
    - dependency-injection-container
    - di
    - dic
    - service-manager

---

Some time ago I wrote the most successful article of this blog, [Advanced usage of ServiceManager in Zend Framework 2](/2014/10/09/advanced-usage-of-service-manager-in-zend-framework-2/), explaining all the ways a service can be created by making use of the Zend\ServiceManager, the service container component in Zend Framework 2.

On this article I'm going to show an example where objects and services are all managed and created with a `ServiceManager` instance, which makes decoupling and dependency injection very easy.
 
It is not a Zend Framework 2 application, because the `ServiceManager` is so integrated there that its power could go unnoticed. Instead, I'm using a Slim framework based application, which solves some common problems that has nothing to do with this article (like routing and request dispatch) and allows me to concentrate on what's important.

### Getting the application

As usual, I have hosted the example application on github. Clone it from [here](), install dependencies by running `composer install` and  start the built-in web server by running `php -S 0.0.0.0:8000 -t public`.

<blockquote>
    <small>If you are not familiar with composer, take a look at this <a href="/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/">article</a>.</small>
</blockquote>

### The structure

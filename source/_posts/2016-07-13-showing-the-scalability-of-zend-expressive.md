---
title: Showing the scalability of Zend Expressive
tags:
    - zend-expressive
    - microframework
    - scalable
    - zf3
categories:
    - php
    - zf

---

I've been working with some different frameworks lately. One of them is [Zend Expressive](https://docs.zendframework.com/zend-expressive/), and I've come to the conclusion that I don't need to use one or another framework depending on the project, Expressive always fits my needs and scales from small projects to bigger applications.

### The Microframework approach

The first thing that one could see on the "Hello world" example is that Expressive is a usual microframework.

You create the app object and programatically register some routes. Something like this:

```php
use zend\Expressive\AppFactory;

include __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/greet/{name}', function ($request, $response, $out = null) {
    $response->getBody()->write(sprintf('Hello %s!!', $request->getAttribute('name')));
    return $response;
});
$app->('/about', function ($request, $response, $out = null) {
    ob_start();
    include 'templates/about.html';
    $response->getBody()->write(ob_get_clean());
    return $response;
});

$app->pipeRoutingMiddleware();
$app->pipeDispatchMiddleware();
$app->run();
```

This is a super simple example. The best approach for prototyping and small applications. You can write the whole app in hours.

This same approach is used by other microframeworks.

However, if your application grows, this could be hard to maintain.

* What if your application has 100 different routes instead of 2.
* What if you need to render dynamic templates.
* What if you have to use complex services while dispatching your routes. They will need to be created somewhere.

In the past you had to take this into account. A microframework was good for small projects (websites, blogs, and such), but for bigger projects one used to choose frameworks like Symfony, Laravel or Zend Framework with the MVC stack. This is no longer necessary with Zend Expressive.

Zend Expressive allows the previous approach, but also other approaches which remind to these bigger frameworks. Some of the features that make Zend Expressive my framework of choice for any kind of project are:

* Not coupled to a specific implementation for dependency injection, templating or routing
* Supports configuration-driven approach
* Supports complex dependency injection by using advanced dependency injection containers like Zend\ServiceManager
* Supports modular applications, easing code reuse
* It is based on middleware
* It is not hard to implement a mvc-like system with controllers

### Choosing implementations

### Configuration driven applications

One of the best things about Zend Expressive is that you can move all the configuration to dynamic configuration files, including:

* Definition of routes
* Definition of middlewares
* Definition of template renderer, router and container implementations
* Definition of configurations consumed by other services

In order to achive this, instead of creating the application with the static factory (`Zend\Expressive\AppFactory`), you have to use the container factory (`Zend\Expressive\Container\ApplicationFactory`).

It is intended to be used with a dependency injection container, and a more complex process is used while creating the application.

### Complex dependency injection

### Modular applications

### The middleware approach

### Controller-style dispatch

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

The first thing that make Expressive different from other frameworks is that it doesn't come with its own implementation for everything. They don't try to reinvent the wheel, instead, they rely on interfaces so that you can use the component of your choice for routing, templating and dependency injection. You could also implement your own if you prefer.

For example, by default expressive supports three routers. FastRoute, Aura router and ZF2 router. In my website I needed a router with support for optional parameters at the beginning of the route, and none of them supports it.

My solution was integrating Slim 2 router, which allows that. https://github.com/acelaya/expressive-slim-router

### Configuration driven applications

One of the best things about Zend Expressive is that you can move all the configuration to dynamic configuration files, including:

* Definition of routes
* Definition of middlewares to pipe
* Definition of template renderer, router and container implementations
* Definition of configurations consumed by other services

In order to achieve this, instead of creating the application with the static factory (`Zend\Expressive\AppFactory`), you have to use the container factory (`Zend\Expressive\Container\ApplicationFactory`).

It is intended to be used with a dependency injection container, and a more complex process is used while creating the application.

It fetches the configuration of the application itself from a `config` service, which should contain an array with keys like `routes` or `middleware-pipeline`.

For example, if we want to register the same routes defined in the first example via configuration, we need to define something like this.

```php
return [

    'routes' => [
        [
            'name' => 'greet',
            'path' => '/greet/{name}',
            'middleware' => function ($request, $response, $out = null) {
                $response->getBody()->write(sprintf('Hello %s!!', $request->getAttribute('name')));
                return $response;
            },
            'allowed_methods' => ['GET'],
        ],
        [
            'name' => 'about',
            'path' => '/about',
            'middleware' => function ($request, $response, $out = null) {
                ob_start();
                include 'templates/about.html';
                $response->getBody()->write(ob_get_clean());
                return $response;
            },
            'allowed_methods' => ['GET'],
        ],
    ],

];
```

With this, the `ApplicationFactory` preregisters all the routes before returning the `Application` instance.

The same happens with non-routable middleware (we'll talk about middleware later), and other configurations.

With this approach, the first thing we need to do is create the dependency injection container, which will be responsible of creating the application object. Something like this:

```php
use Interop\Container\ContainerInterface;
use Zend\Expressive\Application;

/** @var ContainerInterface $container */
$container = include __DIR__ . '/../config/container.php';
/** @var Application $app */
$app = $container->get(Application::class);
$app->run();
```

### Complex dependency injection

I've already said that Zend Expressive allows you to use the implementation of your choice for dependency injection.

In a medium project you can use a simple DI container, like pimple or aura DI. However, in a bigger project you will probably need a more advanced container, like php-di or Zend\ServiceManager. Expressive allows you to use any container that implements `Interop\Container\ContainerInterface`.

### Modular applications

### The middleware approach

### Controller-style dispatch

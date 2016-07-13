---
title: Showing the scalability of Zend Expressive
tags:
    - zend-expressive
    - microframework
    - scalable
    - programmatic
    - configuration
    - dependency-injection
    - zf3
categories:
    - php
    - zf

---

I've been working with some different frameworks lately. One of them is [Zend Expressive](https://docs.zendframework.com/zend-expressive/), and I've come to the conclusion that I don't need to choose between different frameworks depending on the project, Expressive always fits my needs and scales from small projects to bigger applications.

### The Microframework approach

The first thing that one could see on the ["Hello world" example](https://docs.zendframework.com/zend-expressive/getting-started/standalone/) is that Expressive seems like a usual microframework.

You create the app object and register some routes. Something like this:

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

This is a super simple example, the best approach for prototyping and small applications. You can write the whole app in hours.

This is the so called "programmatic approach", and you can read more about it [here](https://mwop.net/blog/2016-05-16-programmatic-expressive.html). This same approach is used by other microframeworks.

However, if your application grows, this could be hard to maintain.

* What if your application has 100 different routes instead of 2.
* What if you need to render dynamic templates.
* What if you have to use complex services while dispatching your routes. They will need to be created somewhere.

In the past you had to take this into account. A microframework was good for small projects (websites, blogs, and such), but for bigger projects one used to choose frameworks like Symfony, Laravel or Zend Framework with the MVC stack. This is no longer necessary with Zend Expressive.

Zend Expressive allows the previous approach, but also other approaches which remind to these bigger frameworks. Some of the features that make Zend Expressive my framework of choice for any kind of project are:

* Decoupled from specific implementations for dependency injection, templating or routing
* Supports configuration-driven approach
* Supports complex dependency injection by using advanced dependency injection containers like Zend\ServiceManager
* Supports modular applications, easing code reuse
* It is based on middleware
* It is not hard to implement a mvc-like system with controllers

### Choosing implementations

The first thing that makes Expressive different from other frameworks is that it doesn't come with its own implementation for everything. They don't try to reinvent the wheel, instead, they rely on interfaces so that you can use the component of your choice for routing, templating and dependency injection. You could also implement your own if you prefer.

For example, by default expressive supports three routers. FastRoute, Aura router and ZF2 router. In my website I needed a router with support for optional parameters at the beginning of the route, and none of them supports it.

My solution was integrating [Slim 2 router](https://github.com/acelaya/expressive-slim-router), which allows that.

Something similar is possible while choosing the templates renderer. Expressive comes with built-in support for Twig, Plates and Zend\View, but you can use whichever renderer you like. It shouldn't be hard to integrate Laravel's Blade, for example.

For dependency injection, Zend Expressive supports any container implementing `Interop\Container\ContainerInterface`, so there are plenty of options to choose.

### Configuration driven applications

One of the best things about Zend Expressive is that you can move all the configuration to dynamic configuration files, including:

* Definition of routes
* Definition of middlewares to pipe
* Definition of template renderer, router and container implementations
* Definition of configurations consumed by other services

In order to achieve this, instead of creating the application with the static factory (`Zend\Expressive\AppFactory`), you have to use the container factory (`Zend\Expressive\Container\ApplicationFactory`).

It is intended to be used with a dependency injection container, and a more complex process is used while creating the application.

It fetches the configuration of the application itself from a `config` service, which should contain an array (or ArrayObject) with keys like `routes` or `middleware-pipeline`.

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

We have already seen that Zend Expressive allows you to use the implementation of your choice for dependency injection.

In a medium project you can use a simple DI container, like pimple or aura DI. However, in a bigger project you will probably need a more advanced container, like php-di or Zend\ServiceManager. Expressive allows you to use any container that implements `Interop\Container\ContainerInterface`.

If none is defined, the static `AppFactory` uses a Zend\ServiceManager instance, and the `ApplicationFactory` injects into the application the same container that was used to invoke it.

Other microframeworks assume that you are working on a small project, and you are a little bit limited by their DI implementation. Expressive gives you the freedom to use the implementation that best suits your needs.

### Modular applications

For big projects, modularity is very important.

You can wrap classes, configuration, language files, templates, tests, etc, in a self-contained package that can be installed in other projects.

Other frameworks like ZF2 and Symfony provide great solutions for this (modules and bundles), and it is easy to do this with Expressive too, while you can still work in a single-module way if the project doesn't need more complexity.

In order to add modularity to an Expressive project, you can use the [mtymek/expressive-config-manager](https://github.com/mtymek/expressive-config-manager) package. It includes a simple class that is able to merge the configuration from many sources (while working with the configuration-driven approach), so that the application is created by being aware of all of those modules, and thus, get preconfigured services or override other configurations.

You just need to define the configuration of every module and an invokable class that provides the configuration itself.

Indeed, that package can be used in any project, not just Expressive-based projects, but it was built with Zend Expressive in mind.

### The middleware paradigm

New microframeworks are working with the middleware paradigm. Expressive is one of them.

Middleware is a great way of defining pieces of code that are easy to test and reuse in other middleware-based projects.

If you need to learn more about middleware, this is a great article to read now https://mwop.net/blog/2015-01-08-on-http-middleware-and-psr-7.html

Expressive uses middleware not only before dispatching a route, but also for the route itself, so in the end everything is middleware.

Also, unlike other microframeworks where you need to provide callables every time you need a middleware, Expressive supports passing service names, which makes it use the DI container in order to get the middleware instance. This improves performance and eases dependency injection.

This approach can be used both in the programmatic and the config-driven approaches.

```php
use Zend\ServiceManager\ServiceManager;

$sm = new ServiceManager([
    'invokables' => [
         \MyMiddleware::class => MyMiddleware::class,
    ],
]);

$app = AppFactory::create($sm);
$app->get('/home', \MyMiddleware::class);

// [...]
```

When this app is run and the "/home" route is dispatched, the middleware used to dispatch the request will be lazily fetched from the DI container and invoked.

This same thing could be done with the config-driven approach like this.

```php
use Zend\Expressive\Application,
use Zend\ServiceManager\ServiceManager;

$sm = new ServiceManager([
    'services' => [
        'config' => [
            'routes' => [
                [
                    'name' => 'home',
                    'middleware' => \MyMiddleware::class,
                    'path' => '/home',
                    'allowed_methods' => ['GET'],
                ],
            ],
        ],
    ],
    'invokables' => [
         \MyMiddleware::class => MyMiddleware::class,
    ],
    'factories' => [
        Application::class => Zend\Expressive\Container\ApplicationFactory::class,
    ],
]);

$app = $sm->get(Application::class);

// [...]
```

### Controller-style dispatch

The last thing we need so that Expressive is as similar as possible to bigger frameworks, is being able to dispatch similar requests with the same controller class, allowing us to share dependencies and not having to repeat the same creation process for different middlewares.

This is also possible by using [Abdul](https://twitter.com/samsonasik)'s implementation, which is now part of the official [Expressive cookbook](https://docs.zendframework.com/zend-expressive/cookbook/using-routed-middleware-class-as-controller/).

This reminds to a classic MVC actions controller.

You can also easily define rest controllers as [I explained in my blog](http://blog.alejandrocelaya.com/2016/06/24/dispatch-rest-like-requests-with-a-single-controller-class-in-zend-expressive/) not so long ago.

### Conclusion

What I was trying to show with this article is that the Zend people has reached an important achievement with Zend Expressive.

They have developed a microframework with a low learning curve that can be used in small applications, but it grows as your project does, allowing you to change some pieces in order to get a maintainable application.

That's what I call **scalability**.

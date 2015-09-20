---
title: My first approach to Zend Expressive 
tags:
    - microframework
    - middleware
    - psr-7
    - zend-expressive
    - zend-diactoros
    - zend-stratigility
categories:
    - php

---

One of the trending topics in the PHP world nowadays is the one about microframeworks. It started some years ago with [Slim](http://www.slimframework.com/) and [Silex](http://silex.sensiolabs.org/), but recently it has been an explossion of new microframeworks.

First, Slim's team announced the third version of its own framework, which implemented the psr-7 HTTP standard by taking advantage of the middleware concept. The previos version works with Middleware too, but psr-7 looks to be designed to be used with middleware.

Then, Laravel launched the [Lumen](http://lumen.laravel.com/) project, which is another microframework based on Laravel components, similar to Silex, which is based on Symfony components.

And finally, Zend framework's team launched [Zend Expressive](https://github.com/zendframework/zend-expressive), which is similar to Slim 3 in the fact that it works with middleware and psr-7, built on top of [zend-stratigility](https://github.com/zendframework/zend-stratigility) and [zend-diactoros](https://github.com/zendframework/zend-diactoros).

Recently, after playing with Slim 3 and Zend Expressive, I decided to use the last one to rebuild my website, which used to be a ZF2 application.

It is open source and you can find it [here](https://github.com/acelaya/website-expressive).

### Why microframeworks

I have said several times that composer has completely changed PHP. Now it is possible to access to any package or component in any application, which is a really big advantage. You don't have to stick to certain framework's implementation if there is another one that you like better.

That's made possible to start working with a framework that doesn't have a solution for everything, and your poroject can still scale thanks to the fact that composer gives you access to almost anything.

There is where microframeworks have their power.

Also, having in mind that every time more and more packages depend on common abstractions (like the psr abstractions, psr-3 or psr-7, or the new [container interop](https://github.com/container-interop/container-interop)), those small frameworks can work with many existing powerful components.

### Why Zend Expressive

The first thing that I liked in Zend Expressive is that it doesn't force you to use an implementaiton for common tasks. 

The router, the templates engine and the service container are based on abstractions, which means that you can virtually use whichever fits you the most. It comes with support for two or three of each one, but you could integrate any third party component by implementing an interface.
 
Also, since this framework has been created by the ZF team, it comes with support for ZF2 components, which I am more used to. Specially I like to be able to use the `Zend\ServiceManager`, like in Slim 3.

### Configuration driven apps

All of the microframeworks that I've already mentioned have something in common. They work on top of the main `Application` object, which usually implements methods to define routes and add middleware.

For example, in Slim 3, you can do something like this to dispatch a request:

~~~php
$app = new Slim\App();
$app->get('/hello/:name', function ($req, $res, $args) {
    echo 'Hello, ' . $args['name'] . '!!';
});
$app->run();
~~~

The same thing can be done like this with Silex:

~~~php
$app = new Silex\Application(); 
$app->get('/hello/{name}', function ($name) use($app) { 
    return 'Hello, ' . $app->escape($name) . '!!'; 
}); 
$app->run(); 
~~~

And also, with Expressive, you do it like this:

~~~php
$app = Zend\Expressive\AppFactory::create();
$app->get('/hello/{name}', function ($request, $response, $next) {
    $response->write('Hello, ' . $request->getAttribute('name') . '!!');
    return $response;
});
$app->run();
~~~

It is very similar in every case, and it is good enough for prototyping and small applications. However this is not my favourite approach. I prefer to use the service container as the **main** object, and fetch the `Application` in the front controller as a regular service. The best microframework to work like this is Expressive.

For example, in my website, the front controller looks like this.

~~~php
chdir(dirname(__DIR__));

// [...]

/** @var Interop\Container\ContainerInterface $container */
$container = include 'config/container.php';
/** @var Zend\Expressive\Application $app */
$app = $container->get(Zend\Expressive\Application::class);
$app->run();
~~~

This approach allows me to define some configuration files that are consumed by factories while creating services, and the Application object is treated like another Service, injecting middlewares and routes from config files.

You don't even have to define the factory yourself, since Expressive includes an `ApplicationFactory` that can be registered and it fetches the outstanding configuration for you.

Another cool thing in Expressive is that the `Application` itself is middleware, and so, it can pipe nested `Applications`. It also treats routes as a middleware that is registered to be resolved as a result of certain route, instead of being resolved for every route.

So, in Expressive, everything is middleware lazily fetched from a service container to dispatch HTTP requests.

### Router

Currently, Expressive includes implementations to integrate with three routers. [Aura.Router](https://github.com/auraphp/Aura.Router), [FastRoute](https://github.com/nikic/FastRoute) and [ZF2 MVC router](http://framework.zend.com/manual/current/en/modules/zend.mvc.routing.html). The first is used by default.

For small applications like my website, any of them should be good enough, but I needed routes to support optional params at the beginning of the path (the language). Neither Aura.Router or FastRoute do it, so I had to stick with ZF2's router in combination with a custom Segment route that allows to skip certain parts of the route, otherwise I would have been forced to define the same route with different names, which would have made assembling routes with param inheritance much harder.

The fun thing is that Slim's router does support optional route params at the beginning of the path, at least in version 2. Maybe I try to integrate it in the future with Expressive, since I don't need all the power provided by ZF2's router.

<blockquote>
    <small><b>Update 2015-09-20:</b> I have finally created a Slim's router integration library and I'm now using it. You can find it here <a href="https://github.com/acelaya/expressive-slim-router">https://github.com/acelaya/expressive-slim-router</a></small>
</blockquote>

To make a router other than Aura.Router to be automatically injected in the Applicaiton when using the container's `ApplicationFactory`, you need to register a service with the `Zend\Expressive\Router\RouterInterface` name.

### Template engine

Similarly to the routers, Expressive works with an abstraction layer which eases the task of using any template engine with it. It comes with [Twig](http://twig.sensiolabs.org/), [Plates](http://platesphp.com/engine/) and [Zend\View](http://framework.zend.com/manual/current/en/modules/zend.view.quick-start.html) integration, using the second one by default, but it shouldn't be hard to use anyone else, like [Blade](http://laravel.com/docs/5.0/templates).

I have used twig for my website, because I've been using it lately, and I really like it.

The template engine will be injected in the Applicaiton by fetching the `Zend\Expressive\Template\TemplateInterface` service.

### Service container

The service container is very important in Expressive. All the services, middlewares and configurations are fetched from it. Expressive expects an `Interop\Container\ContainerInterface` object, which is implemented by the most used service containers (or dependency injection containers if you prefer so).

Documentation on how to use [Zend\ServiceManager](http://framework.zend.com/manual/current/en/modules/zend.service-manager.html), [Pimple](http://pimple.sensiolabs.org/) and [Aura.Di](https://github.com/auraphp/Aura.Di) is included in the project. Depending on how big you expect your application to become, you can use one or another, but you should be able to replace it in case of need.

If no container is provided, the Application will use the first one. Also, it has been my choice, and as I said earlier, everything in my website's project is managed by the ServiceManager, even the `Application` object itself.

It's one of my favourite PHP components and I use it whenever I can.

### Error management

Another thing that any framework has to provide is a way to catch requests to invalid routes or uncaught exceptions and errors. In Expressive that's made by the so called `FinalHandler`.

By default it just displays plain text errors, and returns the proper status code (404 or 500). If you want certain template to be rendered, you have to register a `TemplateErrorHandler` in your container, via the `Zend\Expressive\Container\TemplatedErrorHandlerFactory`. It will use a configuration block to know which template has to be rendered in each case, and use the registered template engine to render them.

In development, a `WhoopsErrorHandler` can be used too. It extends the functionality of the `TemplatedErrorHandler` by using [Whoops](http://filp.github.io/whoops/) to display nice errors. Make sure to never use it in production.

### Other considerations

You know now how to use the main components in the framework, but you need to know how [psr-7](http://www.php-fig.org/psr/psr-7/) works and how to use middleware. You should read these articles if you are not familiar with those concepts, since the whole framework is built on top of them.

* [PSR-7 By Example](https://mwop.net/blog/2015-01-26-psr-7-by-example.html)
* [On HTTP, Middleware, and PSR-7](https://mwop.net/blog/2015-01-08-on-http-middleware-and-psr-7.html)

You should also take a look at the official documentation. It is not very long and it's very well structured. [http://zend-expressive.readthedocs.org/en/stable/](http://zend-expressive.readthedocs.org/en/stable/)

### Conclusion

Those are all the things that can be done with Expressive. It could seem too basic, but it is also very extensible via composer. That's its forte.

Probably, for my website I could have used any other microframework (Indeed I was planning to use Slim 3 before Expressive was launched), but I liked Expressive from the beginning and decided to go with it despite it is not stable yet.

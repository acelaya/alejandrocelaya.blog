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

It is open source and you can find it [here](https://github.com/acelaya/website-expressive).

### Why microframeworks

I have said several times that composer has completely changed PHP. Now it is possible to access to any package or component in any application, which is a really big advantage. You don't have to stick to certain framework's implementation if there is another one that you like better.

That's made possible to start working with a framework that doesn't have a solution for everything, and your poroject can still scale thanks to the fact that composer gives you access to almost anything.

There is where microframeworks have their power.

Also, having in mind that every time more and more packages depend on common abstractions (like the psr abstractions, psr-3 or psr-7, or the new [container interop](https://github.com/container-interop/container-interop)), those small frameworks can work with many existing components.

### Why Zend Expressive

The first thing that I liked in Zend Expressive is that it doesn't force you to use an implementaiton for common tasks. 

The router, the templates engine and the service container are based on abstractions, which means that you can virtually use whichever fits you the most. It comes with support for two or three of each one, but you could integrate any third party component by implementing an interface.
 
Also, since this framework has been created by the ZF team, it comes with support for ZF2 components, which I am more used to. Specially I like to be able to use the `Zend\ServiceManager`, which is also possible in Slim 3.

### Configuration driven apps

All of the microframeworks that I've already mentioned have something in common. They work around the main `Application` object, which usually implements methods to define routes and add middleware.

For example, in Slim 3, you can do something like this:

~~~php
$app = new Slim\App();
$app->get('/hello/:name', function ($req, $res, $args) {
    echo 'Hello, ' . $args['name'] . '!!;
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

It is very similar in every case, and it is a good approach for prototyping and small applications. However this is not my favourite approach. I prefer to use the service container as the **main** opject, and fetch the `Application` in the front controller as a regular service. The best microframework to work with this is Expressive.

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

### Router

Currently, Expressive includes implementations to integrate with three routers. [Aura router](https://github.com/auraphp/Aura.Router), [FastRoute](https://github.com/nikic/FastRoute) and [ZF2 MVC router](https://github.com/zendframework/zend-mvc). The first is used by default.

### Template engine

### Service container

### Error management

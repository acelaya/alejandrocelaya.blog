---
title: Managing objects creation and dependency injection with Zend\ServiceManager
draft: true
categories:
    - php
    - zf2
    - tools
tags:
    - zf2
    - zend-framework-2
    - zf2-component
    - dependency-injection
    - dependency-injection-container
    - di
    - dic
    - inversion-of-control
    - service-manager

---

Some time ago I wrote the most successful article of this blog, [Advanced usage of ServiceManager in Zend Framework 2](/2014/10/09/advanced-usage-of-service-manager-in-zend-framework-2/), explaining all the ways a service can be created by making use of `Zend\ServiceManager`, the service container component in Zend Framework 2.

On this article I'm going to show a real example where objects and services are all managed and created with a `ServiceManager` instance, which makes decoupling components and dependency injection very easy.
 
It is not a Zend Framework 2 application, because the `ServiceManager` is so integrated there that its power could go unnoticed. Instead, I'm using a [Slim](http://www.slimframework.com/) framework based application, which solves some common problems that has nothing to do with this article (like routing and request dispatching) and allows us to concentrate on what's important.

### Getting the application

As usual, I have hosted the example application on github. Clone it from [here](https://github.com/acelaya-blog/service-manager-example), install dependencies by running `composer install` and  start the built-in web server by running `php -S 0.0.0.0:8000 -t public`.

<blockquote>
    <small>If you are not familiar with composer, take a look at this <a href="/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/">article</a>.</small>
</blockquote>

If you are used to modern PHP applications, the project structure shouldn't be a problem. There is a `src` folder with the source code, a `public` folder which is the document root of the application, a `config` folder with some configuration files and a `tests` folder with the unit tests.

### Dependency injection

In the past, when I had to learn dependency injection, I found out that many tutorials just explain that it is important to decouple componentes from the application, and pass elements objects instead of letting them to create those elements inside themselves.

That's a good theory, but introduces another problem. Without dependency injection, creating an object is as easy as `new FooBar()`, and all dependencies will be automatically created on the inside, but with dependency ibjection I could end with something like this.

```php
$logger = new Logger('/var/log/mylogs.log');
$serviceOne = new ServiceOne('foo', 'bar');

$config = include __DIR__ . '/config/config_file.php');
$serviceTwo = new ServiceTwo($serviceOne, $config['param'], $config['another_param']);

$fooBar = new FooBar($serviceTwo, $logger);
```

Now I have to pass two dependencies to my `FooBar` object. One of them also dependes on another object and a raw configuration. And this process could even be more complex.

When I try to explain dependency injection, people usually tries to mentally adapt their old code and substitute the `new FooBar()` with the previous code snippet, and their reaction is usually "*Dependency injection is hard! I will need to duplicate a lot of code!*".

What those tutorials does not explain is how to solve this new problem, and that we now should define the way the objects are created just in one place, and have some mechanism to access to that objects once created anywhere else.

That task is usually performed by an object, the "inversion of control" container, in plenty of forms, a service locator, service container, dependency injection container...

The `ServiceManager` is going to act as the "inversion of control" container of this project. Let's see how.

### Solving the problem

Now that we have identified the problem, let's take a look at the example, and how the `ServiceManager` is capable of managing the whole application, making the task of creating objects much easier and without code duplication.

The project's front controller is the `public/index.php` file, which only includes the `src/bootstrap.php` file. The first thing we do is create the `Serviceanager` instance (there is no need for more than one in the whole project) by consuming the configuration in `config/services.php`.

```php
$sm = new ServiceManager(new Config(include __DIR__ . '/../config/services.php'));
```

After that, we use the `ServiceManager` to get the **app** instance, the main object in Slim framework, and register a couple routes.

```php
/** @var Slim $app */
$app = $sm->get('app');

// Homepage
$app->get('/', function () use ($app) {
    $app->render('home.phtml');
})->name('home');

// Users pages
$app->group('/users', function () use ($app, $sm) {
    $app->addControllerRoute('/list', UserController::class . ':list')
        ->name('users-list')
        ->via('GET');
    
    // ...
});

// Items pages
$app->group('/items', function () use ($app, $sm) {
    $app->addControllerRoute('/list', ItemController::class . ':list')
        ->name('items-list')
        ->via('GET');
        
    // ...
});
```

Thanks to the `ServiceManager`, we have obtained the **app** object with just one instruction `$sm->get('app')`, as easy as doing `new \Slim\Slim()`, but the `ServiceManager` has customized and cached our object, we just had to previously tell it how to do it.

If we go to the `config/services.php` file, we'll see that there is an 'app' service defined as an alias of the `Slim::class` service, which in turn is an invokable, which means that it will be constructed by the `ServiceManager` just by instantiating the object with no arguments in the constructor.

But we said that the object has been customized. Where did that happen?

If we go to the delegators block, we'll see that there is defined one delegator for the `Slim::class` service. Delegators are called by the `ServiceManager`, allowing us to customize certain service when it is going to be created.

Our SlimDelegator sets some configuration options in the Slim instance after it is created and before it is returned by the `ServiceManager`.

<blockquote>
    <small>The name of a service can be anything as long as it is unique. Using the fully qualified class name is just a convention when there is only one way to create the object returned.</small>
</blockquote>



### Unit tests

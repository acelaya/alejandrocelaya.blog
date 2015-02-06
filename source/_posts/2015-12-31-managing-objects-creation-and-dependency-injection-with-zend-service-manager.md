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

What those tutorials does not explain is how to solve this new problem, and that we now should define the way the object is created just in one place, and have some mechanism to access to that object once created anywhere else.

That task is usually performed by an object, the "inversion of control" container, in plenty of forms, a service locator, service container, dependency injection container...

The `ServiceManager` is going to act as the "inversion of control" container of this project. Let's see how.

### Solving the problem

Now that we have identified the problem, let's take a look at the example, and how the `ServiceManager` is capable of managing the whole application, making the task of creating objects much easier and without code duplication.

### Unit tests

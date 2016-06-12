---
title: Using ServiceManager 3 lazy services to improve your PHP application performance
tags:
    - lazy-services
    - service-manager
    - services
    - factories
    - delegators
    - zf3
categories:
    - php
    - zf

---

Performance is an important subject when a project grows.

There are some good practices that make projects more maintainable, like [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection), however, creating all the objects at the beginning of the request could reduce the application performance.

If some of the created objects are not finally used, we have wasted CPU time and memory for no reason.

### DI pattern basics

The dependency injection pattern is "simple". It is one way to implement the [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle), and it says that all the objects that certain subject depends on should be injected on it when the subject is created, rather than letting the subject internally create them at runtime.

This decouples every part of the application and eases testing each subject.

However, what happens if some of those objects are not finally used?

### The proxy pattern to the rescue

A proxy is a lightweight wrapper for an expensive object. It implements the same type of the wrapped object, but delays the object creation until it is going to be really used, for example by overriding all the public methods and initializing the wrapped object the first time one of them is called.

If we used proxies for every expensive dependency, the previous problem would be solved. We can still inject the dependency, but it will be wrapped by the proxy, which will create the object itself once we need it, or never, if it is not finally used.

This is the principle behind lazy services. The ServiceManager makes use of the [ocramius/proxy-manager](https://github.com/Ocramius/ProxyManager) package to create proxies on the fly for all the services configured as lazy.

### Lazy services config

The `lazy_services` config block used to be an independent block on v2 of the ServiceManager. On v3 it has been integrated on the ServiceManager configuration itself, along with `factories`, `invokables` and such.

This is an example of `lazy_services` usage:

```php
use Acelaya\Database\DbConnFactory;
use Acelaya\Service\MyExpensiveService;
use Acelaya\Service\MyExpensiveServiceFactory;
use Zend\ServiceManager\Proxy\LazyServiceFactory;
use Zend\ServiceManager\ServiceManager;

$sm = new ServiceManager([
    'factories' => [
        'db_connection' => DbConnFactory::class,
        MyExpensiveService::class => MyExpensiveServiceFactory::class,
    ],

    'lazy_services' => [
        'class_map' => [
            'db_connection' => \PDO::class,
            MyExpensiveService::class => MyExpensiveService::class,
        ],
        'proxies_target_dir' => 'data/proxies',
        'proxies_namespace' => 'AcelayaProxy',
        'write_proxy_files' => getenv('APPLICATION_ENV') === 'prod',
    ],

    'delegators' => [
        'db_connection' => [
            LazyServiceFactory::class,
        ],
        MyExpensiveService::class => [
            LazyServiceFactory::class,
        ],
    ],
]);
```

**But how does this work?**

The first thing we have to do is register our services the regular way. In this case I have registered 2 services in the `factories` block, the `db_connection`and the `MyExpensiveService`. I can fetch those services in a normal way, and their factories will be hit in order to create them.

But we don't want that. We want a proxy to be returned, wrapping the factory that will be hit only when the object is going to be used.

The next block, `lazy_services`, wraps some config params, like the `class_map`, which determines the class that needs to be proxied for each service (sometimes the service name is the class itself, but we still have to map it).

Finally, by making use of the `delegators` block, we have to add a built-in delegator to each lazy service, the `Zend\ServiceManager\Proxy\LazyServiceFactory`.

**Important!**: If your service needs more delegators, this one should be the last one of the list, so that it is the first one hit.

This delegator is the one which makes the magic. Instead of calling the next delegator until the factory is hit, it returns the generated proxy, and makes it wrap the next factory, so that the delegators chain which ends on the main factory, is only hit the first time the object is going to be used.

The rest of the `lazy_services` properties are only used for convenience.

* The `proxies_target_dir` tells where proxies should be created. If you don't define it, the system temp dir will be used.
* The `proxies_namespace` tells the namespace to be used for proxy classes.
* The `write_proxy_files` property is a boolean which tells whether to persist generated proxies or generate them every time. It is a good idea that you set it to false on development, so that proxies are regenerated every time, in case the proxied classes have changed, and true on production to improve performance, so that once a proxy has been created, the same file is used every time.

### How to fetch lazy services

The good thing is that the whole process is transparent. You don't need to change your code.

If you were already fetching services and you want to make them lazy, you just need to map them and add the `LazyServiceFactory` delegator in the ServiceManager config. Everything else remains the same.

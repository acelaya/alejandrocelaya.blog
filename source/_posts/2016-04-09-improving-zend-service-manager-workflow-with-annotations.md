---
title: Improving Zend\ServiceManager workflow with annotations
tags:
    - login
    - cookie
    - persistent-login
    - persistent-session
categories:
    - php
    - zf2

---

Everyone who regularly visits my blog knows that I'm a complete fan of the [Zend\ServiceManager](http://zendframework.github.io/zend-servicemanager/) component.

It is always my choice to deal with dependency injection in any kind of project, more now that v3 has been released, which is faster and has a better public API.

The workflow while working with the `ServiceManager` is usually the same. You create a factory or abstract factory that creates a service and then you register that service into the `ServiceManager` itself.

Of course you have to optimize your code, and you should try to reuse the same factories whenever possible, and try not to abuse of abstract factories and initializers.

### Detecting a problem

The thing is that if your project grows, you will end with lots of services, and probably lots of factories too.

There are services that are complicated to create, like the `Application` object in many frameworks, or services like doctrine's `EntityManager`. They need to check a lot of configuration elements, and not only get some dependencies injected.

The factory pattern is perfect for these kind of services, but there are a lot of services too where you end up creating a factory just to fetch a couple services from the `ServiceManager` and injecting them in the new service constructor.

This could be an example:

```php
namespace Acelaya\Factory;

use Acelaya\Foo;
use Acelaya\MyService;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class MyFactory
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $foo = $container->get(Foo::class);
        $bar = $container->get('bar');
        
        return new MyService($foo, $bar);
    }
}
```

In my applications, these kind of services are very usually more than a half of the total registered services, and at the end it is boring and repetitive, and you have to maintain a lot of classes that don't really do much.

### Proposing a solution

So I decided to find a solution that would allow me not to repeat the same task over and over.

After some research and trying some different solutions I ended up creating the [acelaya/zsm-annotated-services](https://github.com/acelaya/zsm-annotated-services) package, which allows you to annotate your service constructors and use a common factory which is already provided. It supports both v2 and v3 of the ServiceManager.

By making use of the `$requestedName` argument that all ServiceManager factories receive (even in v2, although it is not in the FactoryInterface), and assuming that the service name is the fully qualified class name, that factory reads a special `@Inject` annotation in the service constructor, which contains the name of the services that need to be injected.

This way, the service in the previos example could be defined like this:

```php
namespace Acelaya;

use Acelaya\ZsmAnnotatedServices\Annotation\Inject;

class MyService
{
    /**
     * @Inject({Foo::class, "bar"})
     */
    public function __construct(Foo $foo, $bar)
    {
        // [...]
    }
}
```

The `@Inject` annotation receives an array of service names in the same order that they need to be injected in the constructor. Then the provided `AnnotatedFactory` reads that list and fetches them from the `ServiceManager`, and finally creates the service and injects the dependencies in the same order. You just need to register the service like this:

```php
use Acelaya\MyService;
use Acelaya\ZsmAnnotatedServices\Factory\V3\AnnotatedFactory;
use Zend\ServiceManager\ServiceManager;

return new ServiceManager([
    'factories' => [
        MyService::class => AnnotatedFactory::class,
    ],
]);
```

This is perfect, because we don't need to create a new factory for every service. We can always use the provided factory to register many services.

That allows us not to have to maintain so many classes, so many tests and also it means that a lot less includes are going to be done by the autoloader.

Also, using factories instead of abstract factories is faster at runtime.

### Considerations

There are, however, a couple of things to have in mind while using this package.

Processing the annotations on every request is very slow. That's why this package allows you to provide a [doctrine/cache](https://github.com/doctrine/cache) adapter where the result of processing the annotations is saved. If you use an in-memory cache adapter (like `ApcuAdapter`), this package has almost no performance penalty.

In order to register a cache adapter, you just need to register a service with the **Acelaya\ZsmAnnotatedServices\Cache** key that returns a `Doctrine\Common\Cache\Cache` instance. The key is provided as a `CACHE_SERVICE` constant in the `AnnotatedFactory` class, so the previos example could be improved like this:

```php
use Acelaya\MyService;
use Acelaya\ZsmAnnotatedServices\Factory\V3\AnnotatedFactory;
use Doctrine\Common\Cache\ApcuCache;
use Doctrine\Common\Cache\ArrayCache;
use Zend\ServiceManager\ServiceManager;

return new ServiceManager([
    'factories' => [
        MyService::class => AnnotatedFactory::class,
        AnnotatedFactory::CACHE_SERVICE => function () {
            return getenv('APP_ENV') === 'production' ? new ApcuCache() : new ArrayCache();
        }
    ],
]);
```

It is a good idea to provide a non-persistent cache for development environments.

Also, the package has currently some limitations. Some of them will probably get fixed in the future, as new versions are released.
 
* It is not possible to perform setter or property injection, just constructor injection. Since setter injection is not a good practice, I'm not sure if this is going to change.
* It is not possible to inject something that is not registered in the container. All the dependencies need to be services themselves.
* <del>If a service returns an array, you cannot pick just a key from it, but I will probably support this in future versions.</del><br>**Update 2016-04-10.** As of v0.2, it is already possible to fetch just one part of an array by using dot notation. For example, **config.mail.smtp**
* The `AnnotatedFactory` cannot create services that are not identified by their fully qualified class names.

Anyway, if there is a service complex enough that you can't create with annotations, you can always use regular factories.

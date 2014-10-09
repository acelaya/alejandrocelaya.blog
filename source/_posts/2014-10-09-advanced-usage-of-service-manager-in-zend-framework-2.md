---
title: Advanced usage of ServiceManager in Zend Framework 2
categories:
    - php
    - zf2
tags:
    - service-manager
    - services
    - design-patterns
    - factory
    - zf2
    - zend-framework-2

---

After a time working with Zend Framework 2 one is used to use the `ServiceManager`, which is one of the most powerful components in the framework.

It eases the creation of objects and performing dependency injection, allowing us to define how objects are created just in one place and letting the `ServiceManager` to consume that code and create instances for us.

But it's easy to finish creating new factories for every object, which will lead us to code duplication if we have different objects that can be similarly created.

I'll try to explain all the ways the `ServiceManager` can create objects so that we can optimize our code and avoid duplication.

By now, let's see all the possibilities of a service_manager configuration.

~~~php
<?php
return [
    'service_manager' => [
        'services' => [],
        'invokables' => [],
        'factories' => [],
        'initializers' => [],
        'abstract_factories' => [],
        'delegators' => [],
        'aliases' => [],
        'shared' => [],
    ]
];
~~~

### Services and invokables

The two most simple ways to create services is by defining them in the **services** or in the **invokables** blocks.

Services defined in **services** are just instances of objects that are created inline. This is not recommended, since we are creating many objects that could never be used.

~~~php
<?php
return [
    'service_manager' => [
        'services' => [
            'ServiceOne' => new \stdClass(),
            'ServiceTwo' => new \stdClass(),
        ],
        
        // [...]
    ]
];
~~~

The rest of the blocks use lazy loading to create objects, which means that objects are created only if they are going to be used. Much more efficient.

Services in **invokables** just define the fully qualified name of a class with no constructor or a constructor with no arguments, that will be instantiated at the moment we fetch the service from the `ServiceManager`.

~~~php
<?php
return [
    'service_manager' => [
        'invokables' => [
            'ServiceOne' => 'Application\Service\MyService',
            'ServiceTwo' => 'Application\Service\AnotherService',
            'ServiceThree' => 'stdClass',
        ],
        
        // [...]
    ]
];
~~~

### Factories

Factories are a bit more advanced than simple object instantiation. They are the easiest way to perform dependency injection.

To create a foctory which is responsible of creating an object, we just have to implement the `Zend\ServiceManager\FactoryInterface`. This way we'll have a `createService` method which will get called by the `ServiceManager` when we request the service, injecting itself on it.

~~~php
<?php
namespace Application\Service\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Application\Service\MyService;

class MyServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $dependencyService = $serviceLocator->get('Application\Service\ServiceOne');
        $translator = $serviceLocator->get('Translator');
        
        return new MyService($dependencyService, $translator);
    }
}
~~~

As you can see, the `createService` method gets a `Zend\ServiceManager\ServiceLocatorInterface` instead of a `Zend\ServiceManager\ServiceManager`. That's because factories can be used to create other types of objects other than services, like controllers, view helpers, controller plugins and such. They are somehow services, but they are handled by a `PluginManager` other than the main `ServiceManager`.

In each case, the proper `PluginManager` is injected, given that all of them implement the `Zend\ServiceManager\ServiceLocatorInterface`.

It is very useful to get a `ServiceLocator` injected in the `createService` method, so that we can fetch other services to inject on the object that we are creating.

Services created by factories are defined in the **factories** block, and you just need to provide a unique identifier for the service (for example the fully qualified name of the object it is going to return) and the fully qualified name of the factory that is responsible of creating it.

~~~php
<?php
return [
    'service_manager' => [
        'invokables' => [
            'Application\Service\ServiceOne' => 'Application\Service\ServiceOne',
        ],
        'factories' => [
            'Application\Service\MyService' => 'Application\Service\Factory\MyServiceFactory',
        ],
        
        // [...]
    ]
];
~~~

<blockquote>
    <small>Factories can also be defined as closures in the <b>factories</b> block, but that is not recommended since configuration files won't be able to be serialized and cached, but it is faster than defining a new class for each factory for prototyping purposes.
    </small>
</blockquote>

### Initializers

Initializers don't really create new objects, they are called after any service is created to make some updates on the state of the object.

For example, we could have an initializer that every time we create an object that implements `Zend\EventManager\EventManagerAwareInterface`, attaches an event handler to the `EventManager` wraped by that service.

Initializers must implement the `Zend\ServiceManager\InitializerInterface`.

~~~php
<?php
namespace Application\Service\Initializer;

use Zend\ServiceManager\InitializerInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\EventManager\EventManagerAwareInterface;

class EventManagerInitializer implements InitializerInterface
{
    public function initialize($instance, ServiceLocatorInterface $serviceLocator)
    {
        if ($instance instanceof EventManagerAwareInterface) {
            $eventManager = $instance->getEventManager();
            $eventManager->attach('foo', function ($e) {
                // Do something...
            });
        }
    }
}
~~~

Every time a new service is created and before returning it, the `initialize` method of this initializer will be called, getting the service instance and the `ServiceLocator` which created it (in our case, the main `ServiceManager`).

There, we perform some checks, and if the service instance meets certain conditions, we can update its state, or indeed, do whatever we want.

If we need any other dependency to be injected on the instance, we can use the `ServiceLocator` to get it.

Initializers are configured in the **initializers** block, and they are just a list of fully qualified class names, they don't need to have a key, since they are applied to every service. Anyway, if you would need to override the configuration of certain initializer, you could give it a key and it would be overriden while merging configurations.

~~~php
<?php
return [
    'service_manager' => [
        'initializers' => [
            'Application\Service\Initializer\EventManagerInitializer',
            'Application\Service\Initializer\LoggerInitializer',
            'Application\Service\Initializer\AnotherInitializer',
        ],
        
        // [...]
    ]
];
~~~

### Abstract factories

Sometimes we have many services that are created in a very similar way because, for example, they have the same dependencies or they extend the same base abstract class.

Abstract factories are used when we try to get a service from the `ServiceManager` that is not been explicitly defined, so it can create multiple services at once.
 
Abstract factories must implement `Zend\ServiceManager\AbstractFactoryInterface` which gives us two methods, the `canCreateServiceWithName` which tells us if this factory is able to create certain type of service, and `createServiceWithName` which creates the service if the first method returned true.

For example, let's imagine we have multiple classes extending the ZfcBase's [AbstractDbMapper](https://github.com/ZF-Commons/ZfcBase/blob/master/src/ZfcBase/Mapper/AbstractDbMapper.php). All of them will need at least a database adapter, an hydrator, an entity prototype and a table name. The entity and the table name can depend on the service itself, and so, be optional arguments with a default value, so this leaves us with just the two first dependencies.

This could be one of the services to be created.

~~~php
<?php
namespace Application\Mapper;

use ZfcBase\Mapper\AbstractDbMapper;
use Application\Entity\User;
use Zend\Db\Adapter\Adapter as DbAdapter;
use Zend\Stdlib\Hydrator\HydratorInterface;

class UserMapper extends AbstractDbMapper
{
    const TABLE_NAME = 'users';

    public function __construct(
        DbAdapter $dbAdapter,
        HydratorInterface $hydrator,
        $entityPrototype = null,
        $tableName = self::TABLE_NAME
    ) {
        $this->dbAdapter        = $dbAdapter;
        $this->hydrator         = $hydrator;
        $this->entityPrototype  = isset($entityPrototype) ? $entityPrototype : new User();
        $this->tableName        = $tableName;
    }
    
    // [...]
}
~~~

Instead of defining a concrete factory for this service, we are going to create an abstract factory that can be reused to create any other similar mapper. We are just going to check if the requested service extends the `AbstractDbMapper` to know if the factory is capable of creating the service.

~~~php
<?php
namespace Application\Service\Factory;

use Zend\ServiceManager\AbstractFactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\Stdlib\Hydrator\ClassMethods as ClassMethodsHydrator;
use ZfcBase\Mapper\AbstractDbMapper;

class MappersAbstractFactory implements AbstractFactoryInterface
{
    public function canCreateServiceWithName(
        ServiceLocatorInterface $serviceLocator,
        $name,
        $requestedName
    ) {
        return class_exists($requestedName)
            && is_subclass_of($requestedName, AbstractDbMapper::class);
    }
    
    public function createServiceWithName(ServiceLocatorInterface $serviceLocator, $name, $requestedName)
    {
        $dbAdapter = $serviceLocator->get('Zend\Db\Adapter\Adapter');
        $hydrator = new ClassMethodsHydrator();
        
        return new $requestedName($dbAdapter, $hydrator);
    }
}
~~~

This factory will be able to create a service as long as the class of the requested service exists and it is a subclass of the `AbstractDbMapper`.

<blockquote>
    <small>Notice that we are using the fully qualied name of concrete mappers as the service name, so in this example we will be able to make this factory to create the UserMapper only if we fetch the service with the name <code>Application\Mapper\UserMapper</code></small>
</blockquote>

The difference between the `$name` and the `$requestedName` arguments are that the second is the name as we requested it (for example **Application\Mapper\UserMapper**) and the first is the name after the `ServiceManager` has resolved it (for example **applicationmapperusermapper**). It depends on your needs which one you use to check if the service can be created.

Finally the service is created by using the `$requestedName` as the class name to create the object and injecting the database adapter and the hydrator on it. Any other mapper will be created the same way so that we don't need to duplicate this code.

The configuration goes in the **abstract_factories** block, and as well as the initializers, they dont need a key name, because the `ServiceManager` will use all the abstract factories to create non-defined services until one of them is able to create it.

~~~php
<?php
return [
    'service_manager' => [
        'abstract_factories' => [
            'Application\Service\Factory\MappersAbstractFactory',
            'Application\Service\Factory\AbstractServicesFactiory',
        ],
        
        // [...]
    ]
];
~~~

### Getting a service

    $sm->get('ServiceName');
    
### Conclusion

It is proven how versatile the `ServiceManager` is. Try to take full advantage of it in your projects.

Even if your project is not based on Zend Framework 2, using this component is a good way to get a powerful service container implementation (or dependency injection container or whatever name you want to give to it), that will do a great job decoupling your classes and making your code clean. 

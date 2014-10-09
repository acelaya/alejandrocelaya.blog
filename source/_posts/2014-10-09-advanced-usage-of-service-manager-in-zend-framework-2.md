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

By now, let's see a complete service_manager configuration.

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

### Getting a service

    $sm->get('ServiceName');

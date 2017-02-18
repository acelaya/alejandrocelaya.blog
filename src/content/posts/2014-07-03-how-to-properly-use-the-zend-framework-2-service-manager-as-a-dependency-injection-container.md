---
layout: post
title: How to properly use the Zend framework 2 service manager as a dependency injection container
tags:
    - zf2
    - zend-framework-2
    - dependency-injection
    - dependency-injection-container
    - di
    - dic
    - service-manager
categories:
    - php
    - zf

---

The service manager is one of the most important components in Zend Framework 2.

It easily allows us to handle object instances, construct them and share them between other objects.

By using a simple configuration file, we define how our objects have to be constructed,  by a simple `new`, by using a `factory`, etc.

~~~php
<?php
return array(
    // ...

    'service_manager' => array(
        'invokables' => array(
            'SimpleService' => 'Application\Service\SimpleService'
        ),
        'factories' => array(
            'ComplexService' => 'Application\Service\Factory\ComplexService'
        ),
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'aliases' => array(
            'translator' => 'MvcTranslator',
        ),
    ),

    // ...
)
~~~

<span class="text-muted">For more information about the service manager configuration read [this](https://framework.zend.com/manual/2.3/en/modules/zend.service-manager.quick-start.html).</span>

### ServiceLocatorAwareInterface

The ServiceLocatorAwareInterface was created to make the service manager to be automatically injected on any object implementing it.

A service initializer is used to accomplish this task. It is automatically registered by Zend Framework.

The problem is that this makes it very easy to use bad practices, because one tends to get services from the service manager instance without making dependency injection. As a consequence we get a very tight coupled code, very hard to test which is not what we want.

The `Zend\Mvc\Controller\AbstractController` class currently implements that interface, and there is an [opened debate](https://github.com/zendframework/zf2/issues/5168) to remove it in the future.

### Dependency Injection

The best way to work with the Service Manager is to use it as a dependency injection container.

By using service [factories](https://github.com/zendframework/zf2/blob/master/library/Zend/ServiceManager/FactoryInterface.php), [abstract factories](https://github.com/zendframework/zf2/blob/master/library/Zend/ServiceManager/AbstractFactoryInterface.php) or [delegator factories](https://github.com/zendframework/zf2/blob/master/library/Zend/ServiceManager/DelegatorFactoryInterface.php), we can get the service manager just at the moment we create an object to fetch its dependencies, inject them in the object and return that object, without injecting the service manager itself.

This is a better practice, which allows us to easily test our code and decouples the components of our application.

~~~php
<?php
namespace Application\Service\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
use Application\Service\MyService;

class MyServiceFactory implements FactoryInterface
{
    public function createService(ServiceLocatorInterface $sm)
    {
        $oneDependency = $sm->get('ModuleOne\Service\OneService');
        $anotherDependency = $sm->get('ModuleTwo\Service\AnotherService');

        return new MyService($oneDependency, $anotherDependency);
    }
}
~~~

As you can see in this factory, we have used the service manager just to locate the dependencies of the object we are creating, but then that object is not “aware” of the service manager any more, to avoid bad practices while using it.

With this implementation we can easily test the `MyService` class by injecting mocks.

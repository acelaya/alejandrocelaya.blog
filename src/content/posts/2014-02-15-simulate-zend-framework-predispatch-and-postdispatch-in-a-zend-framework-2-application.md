---
layout: post
title: Simulate Zend Framework preDispatch and postDispatch in a Zend Framework 2 application
tags:
    - dispatch
    - event-manager
    - events
    - postdispatch
    - predispatch
    - zf2
    - zend-framework
    - zend-framework-2
categories:
    - php
    - zf

---

Any programmer that is used to use Zend Framework version 1 will have been in the situation that Zend Framework version 2 has removed Controller Plugins as they were in the first version of the framework.

Controller Plugins used to allow us to attach code to be executed at some points of the execution process, regardless the controller that was being used.

Two of the most used Controller Plugin methods were `preDispatch()` and `postDispatch()`. These methods were executed just before and after the corresponding action, which was very useful to handle common stuff, like checking if current user is logged in or has a propper role to do what he is trying to do.

Puting this check on `preDispatch()` allowed us to redirect the user to the login or display a 403 page, without duplicating code, which would have made the application difficult to maintain.

### The Zend Framework 2 behavior.

As I said earlier, this behavior has been removed from the framework in the last version. Now a new event-based system is present, which allows us to register code execution to certain situations, even create aour own “situations” to be handled.

One of those events is the dispatch MVC event, which is triggered at the moment the controller action is executed. That is the event we will nedd to handle.

This is an example of a basic Module class where the dispatch event is prepared to be catched when it occurs.

~~~php
<?php
namespace Application;

use Zend\Mvc\ModuleRouteListener;
use Zend\Mvc\MvcEvent;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Zend\ModuleManager\Feature\AutoloaderProviderInterface;

class Module implements ConfigProviderInterface, AutoloaderProviderInterface
{
    public function onBootstrap(MvcEvent $e)
    {
        $eventManager        = $e->getApplication()->getEventManager();
        $moduleRouteListener = new ModuleRouteListener();
        $moduleRouteListener->attach($eventManager);

        $eventManager->getSharedManager()->attach(__NAMESPACE__, MvcEvent::EVENT_DISPATCH, function ($e) {
            // This is executed on dispatch event
        });
    }

    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }
}
~~~

The onBootstrap() method is automatically called when the bootsrap MVC event is triggered on this module, which is one of the firt things that happen when a module is loaded.

In there we have registered an event handler for the dispatch MVC event of this module, by attaching a callback that will be executed when the controller action is called.

The problem is that this code will be called just after the action. To ensure that code is executed before the action (`preDispatch()`) we need to add a priority when the event handler is attached.

~~~php
$eventManager->getSharedManager()->attach(__NAMESPACE__, MvcEvent::EVENT_DISPATCH, function ($e) {
    // This is executed on preDispatch
}, 100);
~~~

Default priority is 1, so any number greater than 1 will make the event to be triggered before.

By using a negative priority we ensure the event is called after the action (postDispatch()), but this is the default behavior.

~~~php
$eventManager->getSharedManager()->attach(__NAMESPACE__, MvcEvent::EVENT_DISPATCH, function ($e) {
    // This is executed on postDispatch
}, -100);
~~~

Attaching multiple event handlers will make the to be executed in order of priority or in the order they were attached when they have the same priority.

Event handlers could be attached to other MVC events, which will allow us to handle other situations. For a full list of MVC events refer to [this Akrabat’s article](https://akrabat.com/a-list-of-zf2-events/).

---
layout: post
title: Create modules with sub-namespaces in Zend Framework 2
tags:
    - autoloader
    - module
    - namespace
    - sub-namespace
    - zend-framework-2
    - zf2
categories:
    - php
    - zf

---

The Zend Framework 2 module system is one of its greatest features. You can create re-usable modules very easily.

Each module has its own namespace, and each one of them should provide an autoloader implementation for the application to be able to load its classes.

### The basics

Usually we give a name to each module and that is the namespace we are going to use for it.

For example, the default module use to be named Application. Its Module class belongs to the Application namespace, making its fully qualified name Application\Module.

Any other class in that module, for example a Service, will belong to the same namespace too. For example Application\Service\FooService.

The same will be applicable for any other module name. Authentication, Admin, WebService… Whatever you think is valid.

The module folder usually has the same name as the module, and the Module class is located in the root of that folder. Then we have an src folder inside of it where a new directory is created for each level in the namespace. In our Application example this would be the folder structure.

~~~
modules
    Application
        src
            Application
                Controller
                    FooController.php
                Service
                    FooService.php
                ...
        Module.php
    ...
~~~

The module class has a method where we define how to load the classes in the module. This could be the Application\Module class

~~~php
<?php
namespace Application;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;

class Module implements AutoloaderProviderInterface
{
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

A Zend\Loader\StandardAutoloader is created defining any class in the same namespace as the Module namespace should be located in the src folder.

### Sub-namespaces in the module

But what happens if we want to use a sub-namespace in our module, lets say because we have to use a common namespace between all of our modules with the name of our company.

Let’s assume our company is called Happy Factory inc. We might want our Application module to use the HappyFactory\Application namespace, and our WebService module to use the HappyFactory\WebService namespace.

This can be easily done by making some changes to our folder structure and autoloader definition.

The module class will be changed to look like this.

~~~php
<?php
namespace HappyFactory\Application;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;

class Module implements AutoloaderProviderInterface
{
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/src/' . str_replace("\\", "/", __NAMESPACE__),
                ),
            ),
        );
    }
}
~~~

We just updated the namespace and make sure to load classes within that namespace.

Now our folder structure. In the basic example the module folder was placed inside the modules folder  (the folder used in Zend Framework 2 by default to load modules), but in this case we are going to have another folder in between, the HappyFactory folder.

~~~
modules
    HappyFactory
        Application
            src
                HappyFactory
                    Application
                        Controller
                            FooController.php
                        Service
                            FooService.php
                        ...
            Module.php
        WebService
            src
                HappyFactory
                    WebService
                        Controller
                            UsersController.php
                        Service
                            AnotherService.php
                        ...
            Module.php
        ...
    ...
~~~

This method is much more verbose and has more empty directories, but it works, and can be combined with regular modules too, just place them outside of the HappyFactory folder.

To load this sub-namespaced modules just add the namespace of the Module class (HappyFactory\Application, HappyFactory\WebService…) in the list of modules in the application.config.php file like this.

~~~php
...

'modules' => array(
    'ZendDeveloperTools',
    'HappyFactory\Application',
    'HappyFactory\WebService',
    'AcMailer',
    'AcAssets',
),

...
~~~

They will be properly loaded with the rest of the company modules and third-party modules.

**UPDATE 2014-06-21**

You can continue reading [the second part](https://blog.alejandrocelaya.com/2014/06/21/create-modules-with-sub-namespaces-in-zend-framework-2-part-ii/) where I’m explaining how to create, install and enable vendor modules with sub-namespaces.

**UPDATE 2014-06-23**

### Properly resolving view template paths

Resolving template paths is not immediate in sub-namespaced modules. It was first said [here](https://blog.alejandrocelaya.com/2014/06/21/create-modules-with-sub-namespaces-in-zend-framework-2-part-ii/#comment-391).

By default, if you don’t set the template to a ViewModel, it is resolved  to a path which is (top level controller namespace)/(controller name)/(action name), which is not what we want here.

In a standard module, let’s say Application, with an Application\Controller\IndexController and an indexAction, the path would be application/index/index.

In a sub-namespaced module like HappyFactory\WebService with a HappyFactory\WebService\Controller\IndexController, the resolved path would be happy-factory/index/index, the same as the one resolved if the module was HappyFactory\Application\Controller\IndexController. If we want them to be happy-factory/web-service/index/index, as we could expect, we have to use the `controller_map` configuration entry, which was introduced in ZF 2.3.

~~~php
<?php
return array(
   'view_manager' => array(
        'template_map' => array(),
        'controller_map' => array(
            'HappyFactory\WebService' => true,
            'HappyFactory\Application' => true,
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
        // ...
    ),
    // ...
)
~~~

Once we have set this for each of our modules (or once for the top level namespace), the template paths would be resolved as one could expect in a sub-namespaced module.

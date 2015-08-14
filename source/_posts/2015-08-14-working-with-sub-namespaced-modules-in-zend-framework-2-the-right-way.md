---
title: Working with sub-namespaced modules in Zend Framework 2 the right way 
tags:
    - autoloader
    - module
    - namespace
    - sub-namespace
    - zend-framework-2
    - zf2
categories:
    - php
    - zf2

---

About a year ago I wrote two articles discussing the best way to work with modules with sub-namespaces in Zend Framework 2.

[Part 1](http://blog.alejandrocelaya.com/2014/05/21/create-modules-with-sub-namespaces-in-zend-framework-2/) and [Part 2](http://blog.alejandrocelaya.com/2014/06/21/create-modules-with-sub-namespaces-in-zend-framework-2-part-ii/)

The solution provided in both those articles was functional, but it introduced some now problems to deal with. It happens that after some time working with sub-namespaced modules I have found the best way to solve those new problems, and I wanted to write this new article explaining it.

For this article I'm going to use the example namespace `ZasDev\AtomicReader`, which belongs to a real [application](http://www.atomic-reader.com) I'm working on. For example, in my `Auth` module, a real fully qualified class name could be `ZasDev\AtomicReader\Auth\Controller\LoginController`.

### The problems

#### Autoloading

By default, ZF2 uses a psr-0-like way to perform autoloading. This would force us to create a new folder per namespace level in our module, but since `Module` classes "are loaded" from the root of the module and the rest of the classes are loaded from the nested src folder, it would be 2 new folders per namespace instead.

With the previously mentioned namespace, the module's folder structure would be this.
 
~~~
modules
└── ZasDev
    └── AtomicReader
        └── Auth
            ├── config
            │   └── ...
            ├── view
            │   └── ...
            ├── src
            │   └── ZasDev
            │       └── AtomicReader
            │           └── Auth
            │               ├── Controller
            │               │   └── LoginController.php
            │               ├── Form
            │               │   └── ...
            │               └── Service
            │                   └── ...
            └── Module.php
~~~

There are people that think that is the correct way to work, but I don't like to have so many empty folders.

#### View scripts resolution

As I mentioned in previous articles, the automatic view script resolution in Zend Framework 2 when a controller's action returns a `ViewModel` instance is to use the action's name as the script name, the controllers' class name as the parent folder, and the first level namespace as the root folder. That is a problem when all the modules have a common first-level namespace.
 
In the original articles we found that the solution was to use the `controller_map` option for the `view_manager` configuration like this.

~~~php
<?php
return [
    'view_manager' => [
        'controller_map' => [
            'ZasDev' => true
        ]
    ]
];
~~~

That will make the view resolver to use all the controller's namespace levels as folder, which solves the original problem but generates a similar problem as in the autoloading, by making us to have a lot of empty folders.

The last example would produce this folder structure for view scripts.

~~~
modules
└── ZasDev
    └── AtomicReader
        └── Auth
            ├── config
            │   └── ...
            ├── view
            │   └── zas-dev
            │       └── atomic-reader
            │           └── auth
            │               └── login
            │                   └── index.phtml
            ├── src
            │   └── ...
            └── Module.php
~~~

### The solutions

It turns out that the solution to both problems is really easy.

This days everybody uses [composer](https://getcomposer.com) on their PHP projects. Using composer's autoloading we can resolve the first problem.
 
By having this folder structure, which is much more usable

~~~
modules
└── Auth
    ├── config
    │   └── ...
    ├── view
    │   └── ...
    ├── src
    │   ├── Controller
    │   │   └── LoginController.php
    │   ├── Form
    │   │   └── ...
    │   └── Service
    │       └── ...
    └── Module.php
~~~

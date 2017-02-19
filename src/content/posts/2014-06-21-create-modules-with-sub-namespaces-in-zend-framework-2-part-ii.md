---
layout: post
title: Create modules with sub-namespaces in Zend Framework 2. Part II
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

Some weeks ago, I explained how to create [modules with sub-namespaces](https://blog.alejandrocelaya.com/2014/05/21/create-modules-with-sub-namespaces-in-zend-framework-2/) in a Zend Framework 2 application.

On that article I created an example module that we could add in our `modules` directory, but what if we want to distribute that module through the [composer](https://getcomposer.org/) network to be installed as a vendor module.

There are a few considerations we have to take into account, since Zend Framework loads the Module class first in one way and then the classes of that module can be loaded by using the autoloader config provided by the Module class.

If the Module class is not in the include path, Zend Framework will try to autoload it, but modules in the vendor folder are not loaded the same way as modules in the modules folder.

By default, with no sub-namespaces, we will get a folder with the name of the vendor (acelaya, for example) and inside of it a folder for each module (zf2-acmailer, for example).

If our module does not follow this standard folder structure we will have to tell Zend Framework where the Module class is, for example in the application config file, in the module_paths part, like this.

If the Module class is not in the include path, Zend Framework will try to autoload it, but modules in the `vendor` folder are not loaded the same way as modules in the `modules` folder.

By default, with no sub-namespaces, we will get a folder with the name of the vendor ([acelaya](https://packagist.org/packages/acelaya/), for example) and inside of it a folder for each module ([zf2-acmailer](https://packagist.org/packages/acelaya/zf2-acmailer), for example).

If our module does not follow this standard folder structure we will have to tell Zend Framework where the Module class is, for example in the application config file, in the `module_paths` part, like this.

~~~php
'module_paths' => array(
    './module',
    './vendor',
    'HappyFactory\WebService\Module' => './vendor/myname/happyfactory/WebService'
)
~~~

But this is not the perfect solution, since we will need to update the config file for each sub-namespaced module we install, and paths can change in the future.

The best solution is to use the composer autoloading system to autoload the Module class, so we can use the folder structure we want for the module, and then the module autoloader config itself will take care to load the rest of the classes.

This way, our composer.json autoload for the module will look like this.

~~~json
{
    "autoload" : {
        "psr-0" : {
            "HappyFactory\\WebService" : "src/"
        },
        "classmap" : [
            "./Module.php"
        ]
    }
}
~~~

The `psr-0` part tells composer how to load the classes in the src folder. The `classmap` part makes composer to be able to load the Module class in a specific file, so Zend Framework will be able to load it by using the composer autoloader just by including it in our modules list like this.

~~~php
'modules' => array(
    'Application',
    'HappyFactory\WebService',
    'AcMailer',
),
~~~

Even so, I would recommend to register  the module at the same folder where the Module class is, that is to say, in our exampple, the WebService folder, instead of the HappyFactory folder.

Here is an example of a real module with subnamespaces you can install with composer [https://github.com/zasDev/common](https://github.com/zasDev/common). The module is in the namespace `ZasDev\Commons`. You can install it in your project by adding `"zasdev/commons" : "0.*"` to your composer.json file.

And that’s all. Nice and easy.

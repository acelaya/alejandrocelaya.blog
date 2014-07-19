---
title: Dependency management and autoloading in php projects with composer
draft: true
categories:
    - php
    - tools
tags:
    - composer
    - building
    - dependency-management
    - continuous-integration

---

One of the common problems we have to confront when starting a new project is how to handle the different dependencies we are going to have.

One could think the easier solution is to download all the libraries we are going to need, put them in a `lib` directory and add them to the version control of the project, but this could be problematic. Let's see why.

The main problems of using this practice are this.

* **Dependencies of dependencies:** Our dependencies may have their own dependencies that we will also need to download.
* **Updates:** What happens if we need a new feature in the last version of one dependendepncy? We are going to have to update it manually, and that can be a hard task. Baybe even the new version has new dependencies of its own that we will need to download.
* **Autoloading:** How do we deal with autoloading the classes in the dependencies? Some of them may have its own autoloading system, but anyway, we are going to need to `include` all the autoloaders of each dependency.

How do we solve all of this? The answer is [Composer](http://getcomposer.org).

Composer has become the dependency manager in the main PHP projects. It uses its own library repository ([packagist](https://packagist.org/)) to handle dependencies, but you can setup private repositories too.

It uses a small configuration file, the `composer.json`, to know which are our dependencies, and it will download their dependencies recursively without us having to do anything special.

We can define an autoloading strategy in that file too, and forget about that task for our project and our dependencies.

This are some examples of famous PHP project's `composer.json` files:

* [Zend Framework](https://github.com/zendframework/zf2/blob/master/composer.json)
* [Symfony](https://github.com/symfony/symfony/blob/master/composer.json)
* [Doctrine](https://github.com/doctrine/doctrine2/blob/master/composer.json)
* [AWS PHP SDK](https://github.com/aws/aws-sdk-php/blob/master/composer.json)
* [Flysystem](https://github.com/thephpleague/flysystem/blob/master/composer.json)

Now lets see a simpler composer file:

~~~json
{
    "name" : "acelaya/zf2-acmailer",
    "description" : "Mail sending module for Zend Framework 2",
    "type" : "library",
    "authors" : [
        {
            "name" : "Alejandro Celaya Alastrué",
            "email" : "alejandro@alejandrocelaya.com",
            "homepage" : "http://www.alejandrocelaya.com",
            "role" : "Developer"
        }
    ],
    "keywords" : [
        "mail",
        "zend",
        "php"
    ],
    "homepage" : "https://github.com/acelaya/ZF2-AcMailer",
    "license" : [
        "BSD"
    ],
    "require" : {
        "php" : ">=5.3.0",
        "zendframework/zendframework": ">=2.2.2"
    },
    "require-dev": {
        "phpunit/phpunit": ">=3.7",
        "squizlabs/php_codesniffer": "1.*",
        "phploc/phploc": "*",
        "pdepend/pdepend" : "1.1.0",
        "phpmd/phpmd" : "1.4.*",
        "sebastian/phpcpd": "*",
        "theseer/phpdox": "0.6.5"
    },
    "autoload" : {
        "psr-0" : {
            "AcMailer" : "src/"
        },
        "classmap" : [
            "./Module.php"
        ]
    }
}
~~~

This is the composer file of my Zend Framework module [AcMailer](https://github.com/acelaya/ZF2-AcMailer). Let's explain it.

The properties name, description, type, authors, keywords, homepage and license are just metadata to provide useful information and ease finding the project while searching in packagist.

The property require is the place where we define our dependencies and the version we want to install. We can define here the minimum required PHP version and even the php modules we need (like `php-pdo`, `php-intl` and such)
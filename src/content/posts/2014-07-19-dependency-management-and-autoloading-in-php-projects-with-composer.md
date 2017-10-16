---
layout: post
title: Dependency management and autoloading in php projects with composer
categories:
    - php
    - tools
tags:
    - composer
    - building
    - dependency-management
    - continuous-integration
    - autoloading

---

One of the common problems we have to confront when starting a new PHP project is how to handle the different dependencies we are going to have.

One could think the easier solution is to download all the libraries we are going to need, put them in a `lib` directory and add them to the version control of the project, but this could be problematic. Let's see why.

The main problems of using this practice are this.

* **Dependencies of dependencies:** Our dependencies may have their own dependencies that we will also need to download.
* **Updates:** What happens if we need a new feature in the last version of one dependendency? We are going to have to update it manually, and that can be a hard task. Baybe even the new version has new dependencies of its own that we will need to download.
* **Autoloading:** How do we deal with autoloading the classes in the dependencies? Some of them may have its own autoloading system, but anyway, we are going to need to `include` all the autoloaders of each dependency.

How do we solve all of this? The answer is [Composer](http://getcomposer.org).

### Starting with composer

Composer has become the dependency manager in the main PHP projects. It uses its own library repository ([packagist](https://packagist.org/)) to handle dependencies, but you can setup private repositories too.

It uses a small configuration file, the `composer.json`, to know which are our dependencies, and it will download their dependencies recursively without us having to do anything special.

We can define an autoloading strategy in that file too, and forget about that task for our project and our dependencies.

This are some examples of famous PHP project's `composer.json` files:

* [Zend Framework](https://github.com/zendframework/zf2/blob/master/composer.json)
* [Symfony](https://github.com/symfony/symfony/blob/master/composer.json)
* [Doctrine](https://github.com/doctrine/doctrine2/blob/master/composer.json)
* [AWS PHP SDK](https://github.com/aws/aws-sdk-php/blob/master/composer.json)
* [Monolog](https://github.com/Seldaek/monolog/blob/master/composer.json)
* [Flysystem](https://github.com/thephpleague/flysystem/blob/master/composer.json)

Now lets see a simpler composer file:

```json
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
```

This is the composer file of my Zend Framework 2 module [AcMailer](https://github.com/acelaya/ZF2-AcMailer). Let's explain it.

The properties **name**, **description**, **type**, **authors**, **keywords**, **homepage** and **license** are just metadata to provide useful information to other users and ease finding the project in [packagist](https://packagist.org/).

The **require** property is the place where we define our dependencies and the version we want to install. We can define here the minimum required PHP version and even the php modules we need (like `php-pdo`, `php-intl` and such).

The **require-dev** property allows us to define other dependencies that won't be necessery in a production environment, like testing or documentation tools.

Finally the **autoload** property is where we define how our own classes are loaded. It is very easy to define a `psr-0` or `psr-4` autoloading strategy, but we can even define a `classmap` with a list of paths to files.

<blockquote>You don't have to remember the <code>composer.json</code> schema. You can interactively create it by running <code>php composer.phar init</code>
</blockquote>

### Installing dependencies

Once this is defined we just need the composer binary file (usually in phar format), that can be found [here](https://getcomposer.org/download/), and run `php composer.phar install`.

This will create a `vendor` folder in the root of our project, download our dependencies there, the dependencies of our dependencies, and set-up an autoloader that will be able to load all our dependencies and our own classes as well.

After this it's enough with a single `include` statement to `vendor/autoload.php` to be able to access any class.

If later in the project we need to update an existing dependency, add new dependencies or change the autoloading, we just need to update the information in the `composer.json` file and run `php composer.phar update` to update dependencies and autoloader.

<blockquote>It is recommended to include the composer binary in the PATH to be able to run <code>composer</code> instead of <code>php composer.phar</code>
</blockquote>

<blockquote>If you are using a VCS like <a href="https://git-scm.com/">git</a> in your project you will probably want to <i>ignore</i> your <code>vendor</code> folder
</blockquote>

### Advanced usages

This should be enough to start working with composer, but it is a much more powerful tool with more features. It is not a bad idea to take a quick read to its [documentation](https://getcomposer.org/doc/), but let's see the main advanced features.

* **Classmap autoloader:** By running `composer dumpautoload --optimize` we can generate a much faster autoloader which defines a class => file map array with all the classes handled by composer. This is the more suitable autoloader for production environments.
* **Production dependencies:** If we include de modifier `--no-dev` while installing or updating dependencies, it will ignore (or remove) the **require-dev** dependencies. For example `composer update --no-dev`
* **Private repositories:** If you want to install dependencies from repositories other than [packagist](https://packagist.org/), you can do it by using the **repositories** property. It supports many types of repositories, from VCS to PEAR repositories. Complete documentation [here](https://getcomposer.org/doc/05-repositories.md).
* **Global packages:** If you want to install dependencies globally, just add the `global` keyword before the `install` or `update`. That will install the dependencies in the `~/.composer/vendor` directory instead of installing them in the local `vendor` directory. For example `composer global update`.

And that's all you need to know to start working with composer.

**Update 2015-04-25**: I've written an article addressing advanced concepts that is a good continuation to this one. [Composer advanced concepts](https://blog.alejandrocelaya.com/2015/04/25/composer-advanced-concepts/).

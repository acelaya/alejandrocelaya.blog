---
title: Composer advanced concepts
categories:
    - php
    - tools
tags:
    - composer
    - building
    - dependency-management
    - continuous-integration

---

[Composer](https://getcomposer.org/) is **The Tool** in any modern PHP project. Nowadays I can't imagine to work without it.

It is much more powerful than some people thinks, easily solving the integration of third party components in our projects, but there are edge cases where standard solutions are not enough.

I'm going to try to explain some of the best practices and mechanisms bundled with composer.

<blockquote>
    <small>If you are not familiar with composer, some time ago I wrote an introduction article that you should read before continuing with this one. <a href="http://blog.alejandrocelaya.com/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/">Dependency management and autoloading in php projects with composer</a>.</small>
</blockquote>

### Globally installing composer

It is a good practice to have composer installed globally, instead of having a binary file per project.

After downloading the `composer.phar` file from the [composer](https://getcomposer.org/download/) website, you can start using it by running `php composer.php ...`. Instead, we are going to place it in a global location so that we can run the command `composer ...` from this moment on.

In UNIX systems, just make the file executable and move it to a folder that's already in the path.

~~~bash
sudo chmod +x composer.phar
sudo mv composer.phar /usr/local/bin/composer
~~~

Now, go to any location and run `composer`. You should see composer's help.

### Create the composer.json file

The first thing you should do when starting a new PHP project is to create the composer.json file. It is the main configuration file, where metadata, dependencies and autoloading are defined.

You probably don't remember the main parts of this file, and end up copying the file from othe projects. There is no need to do that, just run `composer init` and the Composer config generator will be executed, guiding you to the process of creating the file.

### Add dependencies to an existing composer.json file

In the documentation of many libraries, they tell you to manually edit your composer.json file to add new dependencies. That can be problematic, because you could have a syntax error, forget to add a trailing comma, etc.

The best practice to add dependencies to your composer.json file is to run the command `composer require vendor-name/library-name ~3.0`. That will add the new dependency to your file (avoiding syntax errors) and then install it.

If you don't include the version name, composer will try to find out what's the best version to use, by following [Semantic Versioning](http://semver.org/). If it is not able to know which version to use, it will ask you to decide.

### Production environments

The management of dependencies and new classes is not the same in our development environment and production. In development we need new classes to be automatically autoloaded, and we want to have certain dependencies, like phpunit or php code sniffer that are not of any use in production.

In development we will usually install or update dependencies by running `composer install` or `composer update`. That will include all dependencies in **require** and **require-dev** blocks, and generate an autoloader by following different strategies. Some of those autoloading strategies imply the iteration of directories in order to find class files.
 
That is ok for development, but in production we need something more efficient than that, and also, we don't want **require-dev** dependencies to be installed.
 
To get this done, in a deployment process, we should run this command instead.

~~~bash
composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction
~~~

This is what each flag makes:

* **`--no-dev`**: excludes those dependencies defined in the **requre-dev** block.
* **`--optimize-autoloader`**: generates a classmap autoloader, that will map each class with the file that contains it, preventing unnecessary directory iterations.
* **`--prefer-dist`**: installs distributable versions of the libraries, instead of source code, when possible.
* **`--no-interaction`**: will always try to make the proper decission in case any "conflict" is produced, so that the process is completly unatended.

This is the command you should use when deploying a project, just after clonning a clean repository.

### Private repositories

This is probably one of the most important features while working on many private projects that depend on each other.

By default, composer fetches dependencies from a single repository, packagist, which needs to have access to a public repository (usually github). But what happens if my code is private, and I don't want to open source it. May I use composer to install private dependencies? The answer is yes.

### CLI scripts

Sometimes a library includes some command line interface scripts that the user can use to automate configuring some stuff.

If you want to include your own CLI scripts and allow any user to find them when installing your library as a dependency, you will want to define them in the **bin** block.

~~~javascript
{
    "bin": [
        "scripts/generate-foo",
        "scripts/create-bar",
        "scripts/do-something"
    ]
}
~~~

It is just a list of script paths that composer will "copy" to the `vendor/bin` directory after installation (it doesn't really copy them, it creates symlinks in UNIX systems and generates bat files under Windows).

This makes all the CLI scripts of all dependencies to be "placed" in the same location, so it is easier to find them.

This makes sense only in non-root projects (those that will be installed as dependencies and are not base applications).

### Events

Composer will trigger some "events" during the process of installing dependencies, generating autoloaders and such. You can define some scripts or code snippets that will be automatically executed when those events are triggered.

These event listeners are defined in the **scripts** block. They can be either CLI scripts or static class methods.
 
~~~javascript
{
    "scripts": {
        "post-package-install": "Acelaya\\MyClass::postPkgInstall",
        "post-install-cmd": [
            "Acelaya\\MyClass::postInstall",
            "phpunit -c app/"
        ]
    }
}
~~~

The complete list of events can be found in composer's [documentation](https://getcomposer.org/doc/articles/scripts.md#event-names). Take a look at them and see of you can optimize your workflow.

### Applications installation

At this point we all know that we can use composer to install libraries at project level, but what happens with applications, known as **root projects** in composer's terms.

We can also use composer to distribute complete applications, allowing them to be easily installed by using this command.

~~~bash
composer create-project vendor-name/app-name
~~~

This will download the application (as if we would have cloned the repository) and then install its dependencies. We could even take advantage of composer's events, and initialize a database or create some non-tracked directories.

### Conclusion

And that's pretty much all.

Use composer, it will improve your PHP projects.

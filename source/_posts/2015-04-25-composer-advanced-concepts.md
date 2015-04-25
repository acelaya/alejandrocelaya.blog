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

It is much more powerful than some people could think, easily solving the integration of third party components in our projects, but there are edge cases where standard solutions are not enough.

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



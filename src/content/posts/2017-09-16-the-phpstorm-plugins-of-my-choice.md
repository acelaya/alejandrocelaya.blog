---
layout: post
title: "The PhpStorm plugins of my choice"
categories: [tools]
tags: [phpstorm,plugins,ide]
---

Earlier last week I found a [github repository](https://github.com/WyriHaximus/awesome-phpstorm) which collects different resources related with PhpStorm. Plugins, themes, utilities...

I found it very interesting, because I think [PhpStorm](https://www.jetbrains.com/phpstorm/) is the best PHP IDE by far, and I've been using it on an almost daily basis for the last 4 years.

The thing is that finding that repository gave me the idea of writing a post explaining the list of third party plugins I use and why, in case somebody is starting to use the IDE and wants some ideas on where to start.

If you want to get any of them, just search for it inside PhpStorm. It's the easiest way to install them.

### .env

If you work with env files in your development process, either with [vlucas/phpdotenv](https://github.com/vlucas/phpdotenv) (which comes bundled with laravel) or with [symfony/dotenv](https://symfony.com/doc/current/components/dotenv.html), this extension is very handy.

It autocompletes environment variables defined in the .env file and the docker-compose.yml file when using the `env()` or `getenv()` functions.

It also displays the value defined for those env variables inside the file.

![.env](https://alejandrocelaya.blog/assets/img/phpstorm-plugins/dot-env.png)

> As a tip I will say that the first time I installed this plugin it didn't work for me, because I had the .env files associated with the ini file type. Make sure you associate them with the .env type instead to get it working.

Link: [https://plugins.jetbrains.com/plugin/9525--env-files-support](https://plugins.jetbrains.com/plugin/9525--env-files-support)

### .ignore

This plugin detects ignored files for many types of resources. Git, docker, npm and many more.

It adds syntax highlight and autocompletion to those files (.gitignore, .hgignore...), displaying which of the ignored files do not exist anymore.

It also sets a light grey font color in the project explorer for ignored files, so it is easier to "ignore" them.

Finally, it displays a message at the top of the editor when you have opened an ignored file, so that you know it is not going to affect the corresponding tool.

Link: [https://plugins.jetbrains.com/plugin/7495--ignore](https://plugins.jetbrains.com/plugin/7495--ignore)

### BashSupport

If you have to work with shell scripts in any of your projects, this plugin is very useful.

It adds syntax highlight, autocompletion, quickfixes and refactoring for `bash` and `sh`.

It also allows you to add a missing shebang or even run the script right inside PhpStorm by right-clicking and selecting "Run".

![BashSupport](https://alejandrocelaya.blog/assets/img/phpstorm-plugins/bash-support.png)

Link: [https://plugins.jetbrains.com/plugin/4230-bashsupport](https://plugins.jetbrains.com/plugin/4230-bashsupport)

### CodeGlance

This one os more cool than useful.

It adds a minimap inside any file editor, similar to the one that was made popular by Sublime text.

It can be used to get an idea of the size of the file just at a glance.

![CodeGlance](https://alejandrocelaya.blog/assets/img/phpstorm-plugins/code-glance.png)

Link: [https://plugins.jetbrains.com/plugin/7275-codeglance](https://plugins.jetbrains.com/plugin/7275-codeglance)

### PHP Annotations

This one is essential if you work with annotations of any kind (doctrine ORM, jms serializer, and such).

Since PHP does not natively support annotations, everybody that needs that feature uses the package [doctrine/annotations](https://github.com/doctrine/annotations).

It works really great, but since it works at comment level, it is very easy to break something by accident.

This plugin adds a lot of features:

* Mark use statements as used when imported for an annotation.
* Refactor or jump to annotation classes.
* Annotation properties autocompletion (and even values, for well known projects like doctrine/orm).
* Auto alias imports.
* Syntax highlight and error management.

This plugin almost suppresses the possibilities of breaking your code when running an automated use statements optimization or remove part of the annotation by mistake, things that cannot be caught by a unit test.

![PHP Annotations](https://alejandrocelaya.blog/assets/img/phpstorm-plugins/annotations.png)

Link: [https://plugins.jetbrains.com/plugin/7320-php-annotations](https://plugins.jetbrains.com/plugin/7320-php-annotations)

### PHP composer.json support

Everybody uses composer for modern PHP projects, so this plugin is a must.

It autocompletes composer.json blocks, and validates it, but making sure to never suggest a block that's already in the file.

It also displays warnings for common mistakes, like using the dev-master constraint for a dependency.

It is very useful when you don't remember the name of a package, since it autocompletes package names too.

![PHP composer.json support](https://alejandrocelaya.blog/assets/img/phpstorm-plugins/composer.png)

Link: [https://plugins.jetbrains.com/plugin/7631-php-composer-json-support](https://plugins.jetbrains.com/plugin/7631-php-composer-json-support)

### Php Inspections (EA Extended)

If I had to uninstall all my plugins but one, this would be the one that I would keep for sure. Probably the best plugin and the one I use the most on any project.

It adds a huge amount of new inspections to PhpStorm that will greatly improve your code.

To name some:

* Warn about non-annotated thrown exceptions.
* Warn about known PHP security issues.
* Suggest better or more readable language constructions.
* Suggest about more efficient ways of perform known tasks.
* Warn about ugly code smells.
* Warn about suspicious code blocks.

And things like that. It is impossible to list all the things this plugin is able to inspect. I recommend you to install it and test it, because it really improves your productivity.

Link: [https://plugins.jetbrains.com/plugin/7622-php-inspections-ea-extended-](https://plugins.jetbrains.com/plugin/7622-php-inspections-ea-extended-)

### PHPUnit Enhancement

I discovered this plugin in the list I mentioned at the beginning of this article, so I have been using it for a short time.

I still have to tweak it to fit my needs, but it is better than anything anyway.

It mainly tells PhpStorm the type of mocked objects (either by PHPUnit's mocks or by PHPSpec's prophecies). This way, when you try to mock a method, you get autocompletion, and also, If later on you want to refactor that method or find their usages, it will find the mock too.

The problem is that, for example, you might create a prophecy of a method that expects more than one argument or has a specific type hint, and you pass it something like `Argument::cetera()`. That makes it mark an error because the method expects something else.

Apart from that, I think it's worth it.

Link: [https://plugins.jetbrains.com/plugin/9674-phpunit-enhancement](https://plugins.jetbrains.com/plugin/9674-phpunit-enhancement)

### Swagger plugin

When you work on an API that needs to be documented, swagger is a really good tool.

This plugin adds autocompletion and inspections on swagger docs, either yaml or JSON, so that you don't need to wait for external tools to validate your files.

![Swagger plugin](https://alejandrocelaya.blog/assets/img/phpstorm-plugins/swagger.png)

Link: [https://plugins.jetbrains.com/plugin/8347-swagger-plugin](https://plugins.jetbrains.com/plugin/8347-swagger-plugin)

### Conclusion

That's all the third party plugins I use at the moment of writing this article.

If in the future I add any other, I'll update this list.

If you know of any cool plugin that's not listed here, just add a comment to the article so that other can be aware of its existence.

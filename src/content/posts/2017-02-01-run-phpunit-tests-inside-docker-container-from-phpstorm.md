---
layout: post
title: Run PHPUnit tests inside a docker container from PhpStorm
permalink: /2017/02/01/run-phpunit-tests-inside-docker-container-from-phpstorm
tags:
    - phpunit
    - docker
    - phpstorm
    - tests
categories:
    - php
    - tools

---

Docker is, without any doubt, the trending tool these days. Everybody wants to use it, because it is very useful, allowing to easily generate development environments for any kind of application.

A couple months ago I started working with docker myself (it has taken me a while, I know), and now I can't imagine working without it.

I started using it at work, but now I'm migrating all of my OSS projects too.

### The first stopper

Regardless docker is very cool, there is a problem when you start using it.

I had my development environment perfectly configured, and all my tools properly integrated. I was able, among other things, to run any project tests from within PhpStorm, just by right-clicking any test class, test method or phpunit.xml file, and selecting the "Run" option.

However, once you start using docker in the project, it is not that simple.

### Integration with PhpStorm

Gladly, since PhpStorm is a very powerful tool, it supports integration with docker, which can be then used, among other things, to automatically run tests inside a container.

> From this point, I'm going to explain the process, assuming you have already installed docker in your system. If not, you need to install at least [docker engine](https://docs.docker.com/engine/installation/) and [docker compose](https://docs.docker.com/compose/install/).

The first thing you need to do is configure the connection with docker engine. Go to **Settings** -> **Build, Execution, Deployment** -> **Docker**.

Click the green *plus* button and a new docker connection will be created. The only value you should need to change is the API URL:

* **Linux**: unix:///var/run/docker.sock
* **Windows and Mac**: http://127.0.0.1:2376 (The URL of the docker machine. If you are using the deprecated docker toolbox with boot2docker, you have to make sure which is the IP address of the virtual machine)

![Docker in PhpStorm](https://alejandrocelaya.blog/assets/img/phpstorm-docker/phpstorm-docker.png)

Apply changes and we are done here.

### Create the remote interpreter

Now let's create a remote interpreter. It will be used so that tools that need a php runtime are executed inside a docker container.

Go to **Settings** -> **Languages & Frameworks** -> **PHP**. In here, you select the default interpreter for your project.

![Interpreter](https://alejandrocelaya.blog/assets/img/phpstorm-docker/interpreter.png)

Click the button with the three dots, which will open the dialog to create a new interpreter.

![Interpreter dialog](https://alejandrocelaya.blog/assets/img/phpstorm-docker/interpreter-dialog.png)

In that dialog you will likely have a local interpreter. Click the green *plus* button, at the top-left corner, and select **Remote**.

That will open the dialog to create a new remote interpreter. One of the options is to use a docker image from which PhpStorm will create a docker container that should contain a php interpreter.

![Docker iterpreter](https://alejandrocelaya.blog/assets/img/phpstorm-docker/docker-interpreter.png)

In this dialog, just select the server (this is the connection with the docker engine, the one we created in the first step), then select the docker image you want to use. The dropdown will be filled with all the images in your machine.

Finally select the interpreter path. Usually, [PHP-based docker images](https://hub.docker.com/_/php/) have the php interpreter in the PATH, so just setting `php` should be enough.

Save everything and we are done configuring the interpreter.

### Create the PHPUnit config

Now that the interpreter is created, we have to define a phpunit configuration that uses it.

Go to **Settings** -> **Languages & Frameworks** -> **PHP** -> **PHPUnit**, Use the green *plus* button at the top-left corner, select **By Remote interpreter** and a dialog window will be prompt.

It only contains a dropdown where you have to select the remote interpreter we created in previous step.

Select it and you'll see a configuration similar to this.

![PHPUnit configuration](https://alejandrocelaya.blog/assets/img/phpstorm-docker/phpunit.png)

As you can see, PhpStorm mounts the project dir as a volume inside the container, in the `/opt/project` dir, and based on that path, selects the path to composer's autoloader script and the phpunit.xml script.

If any of those params is not correct in your project, you can (and should) change it.

And that's it!

Now, you can right-click any test class, test method or phpunit.xml file and select "Run". PhpStorm will automatically connect with docker engine, set up a temporary container and run the tests inside of it.

You'll know it is working because of this:

![Tests inside container](https://alejandrocelaya.blog/assets/img/phpstorm-docker/tests-in-container.png)

### Conclusion

PhpStorm's team is always working to add integrations with the latest development tools, making it the most powerful IDE for PHP.

Now go, configure your environment and start using docker. It's amazing!

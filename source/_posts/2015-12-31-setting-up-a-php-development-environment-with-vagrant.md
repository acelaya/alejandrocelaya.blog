---
title: Setting up a PHP development environment with Vagrant
draft: true
categories:
    - php
    - tools
tags:
    - vagrant
    - environment
    - devops

---

Setting up a development environment is not always easy, specially for web development. Sometimes you need to install and configure plenty of applications. A database server, a web server, server-side programming language binaries, mail server, job queue server, specific package managers, building tools, debug and profiling tools, etc.

Each one of them will need to be in a concrete version, and you will need to handle their dependencies too. You could think that's a one time task, but what happens when you work on multiple projects at the same time. You need to install that for each one of them, and also make sure there are no conflicts with different environments.

There is a tool that eases this tasks, called [Vagrant](https://www.vagrantup.com/), that allows us to create a virtualized environments with all the tools, system packages and applications we need to use in a project. Each environment is running on its own virtual machine, so there is no conflicts between them.

The configuration of each virtual machine is defined in a file, that can be pushed to the VCS server, so that any other team member can use the same exact environment as you. By using that file, Vagrant creates a machine, downloads the OS and installs it, installs the packages and starts services, so that we can start working in no time.

This is a much more efficient way to work, since that configuration file (called Vagrantfile) can be reused multiple times.

### Creating the Vagrantfile

The only problem vith Vagrant is that you need to know its configuration syntax and have a little system administration experience. 

For a complete Vagrantfile documentation, you can read its [documentation](https://docs.vagrantup.com/v2/vagrantfile/), but instead, I'm going to use one of the multiple online assistants available to create Vagrantfiles. One of the best for PHP projects is [PuPHPet](https://puphpet.com), which is based on Puppet.

This way, we will get a ready to use Vagrantfile with complex configurations on it.

### Installing vagrant

To handle Vagrant machines, you need to install Vagrant on your system.

Binaries for every operating system can be found here https://www.vagrantup.com/downloads.html

After installation you will have the `vagrant` command available from your console.

### Setting up the machine

The first step is to go to [PuPHPet](https://puphpet.com)'s webpage and follow the steps of the wizard. Select the operating system to be installed, the web server, the PHP version and such. Once you finish this you will be able to download a complete configuration file.

We'll explain the steps of this process later.

Extract downloaded file wherever you want, open a console and go to the extracted folder. Now run `vagrant up` and the machine will be created and configured. This process may take some time, so be patient.  

### Guest and host machine integrations

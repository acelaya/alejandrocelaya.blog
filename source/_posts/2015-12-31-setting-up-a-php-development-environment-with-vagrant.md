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
    - automation

---

Setting up a development environment is not always easy, specially for web development. Sometimes you need to install and configure plenty of applications. A database server, a web server, server-side programming language binaries, mail server, job queue server, specific package managers, building tools, debug and profiling tools, etc.

Each one of them will need to be in a concrete version, and you will need to handle their dependencies too. You could think that's a one time task, but what happens when you work on multiple projects at the same time. You need to install that for each one of them, and also make sure there are no conflicts with different environments.

There is a tool that eases this task, called [Vagrant](https://www.vagrantup.com/), that allows us to create a virtualized environments with all the tools, system packages and applications we need to use in a project. Each environment is running on its own virtual machine, so there is no conflicts between them.

The configuration of each virtual machine is defined in a file, that can be pushed to the VCS server, so that any other team member can use the same exact environment as you. By using that file, Vagrant creates a machine, downloads the OS and installs it, installs the packages and starts services, so that we can start working in no time.

This is a much more efficient way to work, since that configuration file (called Vagrantfile) can be reused multiple times.

### Installing vagrant

Vagrant is a command line tool which eases the interaction with the virtual machines. Start a machine, halt a machine open a SSH connection or refresh the configuration by reading the Vagrantfile are easy tasks which only need a certain command to be executed.

There are packages for every major operating system that can be downloaded from [here](https://www.vagrantup.com/downloads.html).

### Creating the Vagrantfile

The Vagrantfile is the main configuration file for the virtual machine. It defines the operating system to be used, the system packages to be installed and how to do it, ports to be mapped to the host machine, folders to be shared, etc.

It is usually placed in the root directory of your project, since the folder containing it will be mapped to the folder `/vagrant` inside the virtual machine. This way the complete project will be available inside the virtual machine, for example to be served by a web server. 
 
A simple example of a Vagrantfile could be this.

```ruby
Vagrant.configure("2") do |config|
    
    # This is the operating system to be installed. Ubuntu 12.04 in this case
    config.vm.box = "hashicorp/precise32"
    
    # The script "bootstrap.sh" will we run within the virtual machine once installed
    config.vm.provision :shell, path: "bootstrap.sh"
    
    # The port 8888 will be forwarded from the local machine to the virtual machine's port 80
    config.vm.network :forwarded_port, host: 8888, guest: 80
    
end
```

This is very easy to undertand. We are telling vagrant to install Ubuntu 12.04, start the machine and run the bootstrap.sh script, which could be used to define which system packages to install.

Then, we forward the port 8888 in the local machine to the port 80 in the virtual machine, so that we can see the application by accessing to `http://localhost:8888`.

You have an example project using this Vagrantfile [here](https://github.com/acelaya-blog/vagrant). Clone it, go to the folder and run `vagrant up`. Once it finishes go to [http://localhost:8888](http://localhost:8888) and you should see a nice **Hello World!** which is being served from the virtual machine.

However, this example is too simple. In real projects we usually have more complex requirements, and configuring the complete Vagrantfile is not so easy.

For this situations, we have multiple online assistants which can be used to create more complex Vagrantfiles. One of the best for PHP projects is [PuPHPet](https://puphpet.com), which is based on Puppet.

### Setting up the machine

The first step is to go to [PuPHPet](https://puphpet.com)'s webpage and follow the steps of the wizard. Select the operating system to be installed, the web server, the PHP version and such, the result depends on your needs. Once you finish this you will be able to download a complete configuration file.

Extract downloaded file wherever you want, open a console and go to the extracted folder. Now run `vagrant up` and the machine will be created and configured. This process may take some time, so be patient.

After a while, the virtual machine will be up an running. You can take a look at the extracted Vagrantfile and see that it is a little more complex than the first example.
 
If you include the Vagrantfile and the puphpet folder in your project you will be able to reproduce the same environment anywhere you go just by clonning the repository.

### Guest and host machine integrations

**SSH access**: One of the more common things we'll need to do is to open a SSH connection against the virtual machine. To accomplish that task we just need to go to the folder where the Vagrantfile lives, or one of its subfolders and run `vagrant ssh`. Now you are able to do anything on the virtual machine as if it were your host machine.

**Folders sync**: Another thing we'll probably need to do is to sync folders between the host machine and the guest machine. As I said earlier, the Vagrantfile parent folder is mapped by default to the `/vagrant` folder in the virtual machine, but we could change the folders in case of need.

To define a folder that should be synced, just place a line like this in your Vagrantfile.
 
```ruby
config.vm.synced_folder "subfolder/", "/anywhere/else/in/the/virtual/machine"
```



### Managing virtual machines



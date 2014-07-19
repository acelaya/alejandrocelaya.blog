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


---
title: Dependency management in Java projects with Ant and Ivy
tags:
    - ant
    - building
    - continuous-integration
    - dependency-management
    - ivy
categories:
    - java
    - tools

---

Dependency management is very important in any kind of project. Any application will need to use third party libraries to avoid to reinvent the wheel.

The problem is that getting each one of them from a different place takes time, and it’s not easy to be sure we get the correct version.

To solve this in java projects we can use an automated dependency manager, like [Maven](https://maven.apache.org/), which is really a building system with dependcy management included. The problem with maven is that it could be hard to use, and not very intuitive.

Instead of Maven, I rather prefer to use [Ivy](https://ant.apache.org/ivy/). It is a more simple and agile dependency management system, designed to be used with [Ant](https://ant.apache.org/), but it takes dependencies from Maven repositories, like [Maven central](https://mvnrepository.com/).

### Getting started

To use Ivy we need to create an `ivy.xml` file in the project root directory. It will be used to define which dependencies are needed by our project, and will need to be downloaded at building time.

This is the [Subconnector](https://github.com/acelaya/subclient-subconnector) Ivy script.

~~~xml
<ivy-module version="2.0">
    <info organisation="net.subclient" module="subconnector" />

    <dependencies>
        <dependency org="junit" name="junit" rev="4.10" />
        <dependency org="com.google.code.gson" name="gson" rev="2.2.2" />
        <dependency org="log4j" name="log4j" rev="1.2.17" />
        <dependency org="org.apache.commons" name="commons-lang3" rev="3.1"/>
    </dependencies>
</ivy-module>
~~~

As you can see, it is very simple. We just defined an info element with the basic project information, and a dependencies element with nested information of each of the dependencies of the project.

For each one of them we have to know its organization, name and revision. With this we can be sure we will get the desired library and revision.

But how do we know what to put in `org`, `name` and `rev` attributes? The [maven central repository](https://mvnrepository.com/) webpage will help us with this.

At the top search bar we can write the name of a library, for example gson. The first result corresponds to the gson artifacts in the maven central. By selecting the desired version we will get the dependency element for an Ivy script, as well as other dependency management systems, like Maven or [Gradle](https://gradle.org/).

![Maven dependency example](https://blog.alejandrocelaya.com/assets/img/dependency.jpg)

We just need to copy and paste it. Nice and easy.

### Automate retrieving dependencies

Once our Ivy script is ready, it is time to include retrieving dependencies in our building process. The easiest way to do it is to create an Ant target in our `build.xml` script, like this.

~~~xml
<target name="retrieve-dependencies"
        description="Retrieve dependencies with Apache IVY">

    <ivy:retrieve type="jar" />

</target>
~~~

This will look for the ivy.xml script and download dependencies defined on it in a lib folder, but only binary jar files. If `type="jar"` is removed, all docs, sources and binaries will be retrieved.

Make sure to add Ivy binaries to Ant classpath to make it properly work. The `project` element in the build script will need also to look like this.

~~~xml
<project basedir="." default="build" name="Subconnector" xmlns:ivy="antlib:org.apache.ivy.ant">

    ...

</project>
~~~

Notice the `xmlns:ivy` attribute.

Now we are ready to go.

For an advanced Ivy configuration take a look at its [official documentation](https://ant.apache.org/ivy/history/2.3.0/index.html). It explains how to use custom repositories, how to set up a proxy server, how to change default local lib folder, etc.
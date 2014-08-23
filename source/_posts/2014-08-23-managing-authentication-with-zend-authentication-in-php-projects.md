---
title: Managing authentication with Zend\Authentication in PHP projects
categories:
    - php
tags:
    - authentication
    - zf2
    - zend-framework-2
    - adapter-pattern
    - composer

---

Authentication is one of the most usual tasks we need to resolve in medium and large web applications.

There are many kinds of authentication. We could use database table authentication, HTTP authentication, LDAP authentication or any other kind of authentication we could imagine. Maybe we need to authenticate with a web service or by using OAuth.

The perfect solution would be to have a scalable component wich, today, let us authenticate over a MySQL database and store the session in the standard PHP session, but tomorrow can be easily be changed to use HTTP authentication and store the session in a PostgreSQL database, without making big changes in our code.

Zend Framework 2 implements that in the [Zend\Auth component](http://framework.zend.com/manual/2.3/en/modules/zend.authentication.intro.html)

### The Zend\Auth component

This component has a main class, the `Zend\Auth\AuthenticationService`, which encapsulates two adapters:

* The authentication adapter, which is responsoble of performing the authentication itself
* The storage adapter, wich is responsible of storing the identity returned by the authentication adapter after a successful authentication. That identity could be any kind of data, from a simple array to a complex object.

Both of them have some predefined implementations, but we could define our own by implementing `Zend\Auth\Adapter\AdapterInterface` and `Zend\Auth\Storage\StorageInterface`

As for this, we could say the **Zend\Auth** component implements the [adapter pattern](http://en.wikipedia.org/wiki/Adapter_pattern), because the AuthetnicationService will never do the job, but delegate both tasks to its adapters. Changing one of the adapters should result in very little code modifications, because the rest of the application depends only in the AuthenticationService.

### Installation

The easiest and recommended way to install this component is by using [composer](https://getcomposer.org/)

Just run `php composer.phar require zendframework/zend-authentication:2.3.*` to get the dependency installed.

It will suggest to install other Zend Framework 2 components that you will probably need if you want to use some of the built-in adapters and storages.

<span class="text-muted">For more information on how to use composer, read [this](http://blog.alejandrocelaya.com/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/)</span>

### Usage

Let's imagine we want our users to use database authentication (the provided username and password will be checked in a table, for example), and store their data in a simple PHP session.

This could be the creation of the AuthenticationService.

~~~php
// [...]

// We have hashed passwords in the database, so we need to treat plain passwords before checking against the table data
$credentialCallbak = function ($dbPassword, $requested) {
    return password_verify($requested, $dbPassword);
};

/** @var \Zend\Db\Adapter\Adapter $dbAdapter */
$adapter = new \Zend\Auth\Adapter\DbTable\CallbackCheckAdapter(
    $dbAdapter,
    'users', // Table name
    'username', // Identity column
    'password', // Password column
    $credentialCallbak // This adapter will run this function in order to check the password
);
~~~

For this tutorial I have avoided the database connection configuration and how we get the username and password the user provided.

If you wan't to know how to create a database adapter (`Zend\Db\Adapter\Adapter`) in Zend Framework 2, just read [this article](http://framework.zend.com/manual/2.3/en/modules/zend.db.adapter.html).

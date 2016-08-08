---
title: Managing authentication with Zend\Authentication in PHP projects
categories:
    - php
    - zf
tags:
    - authentication
    - zf2
    - zend-framework-2
    - adapter-pattern
    - composer
    - zf2-component

---

Authentication is one of the most usual tasks we need to resolve in medium and large web applications.

There are many kinds of authentication. We could use database table authentication, HTTP authentication, LDAP authentication or any other kind of authentication we could imagine. Maybe we need to authenticate with a web service or by using OAuth.

The perfect solution would be to have a scalable component wich, today, let us authenticate over a MySQL database and store the session in the standard PHP session, but tomorrow can be easily changed to use HTTP authentication and store the session in a PostgreSQL database, without making big changes in our code.

Zend Framework 2 implements that in the [Zend\Authentication component](http://framework.zend.com/manual/2.3/en/modules/zend.authentication.intro.html)

### The Zend\Authentication component

This component has a main class, the `Zend\Authentication\AuthenticationService`, which encapsulates two adapters:

* The authentication adapter, which is responsible of performing the authentication itself
* The storage adapter, wich is responsible of storing the identity returned by the authentication adapter after a successful authentication. That identity could be any kind of data, from a simple array to a complex object.

Both of them have some predefined implementations, and we could even define our own by implementing `Zend\Authentication\Adapter\AdapterInterface` and `Zend\Authentication\Storage\StorageInterface`

As for this, we could say the **Zend\Authentication** component implements the [adapter pattern](https://en.wikipedia.org/wiki/Adapter_pattern), because the AuthetnicationService will never do the job, but delegate both tasks to its adapters. Changing one of the adapters should result in very little code modifications, because the rest of the application depends only in the AuthenticationService.

### Installation

The easiest and recommended way to install this component is by using [composer](https://getcomposer.org/)

Just run `php composer.phar require zendframework/zend-authentication:2.3.*` to get the dependency installed.

It will suggest to install other Zend Framework 2 components that you will probably need if you want to use some of the built-in adapters and storages.

<blockquote class="text-muted">
    <small>
        For more information on how to use composer, read
        <a href="https://blog.alejandrocelaya.com/2014/07/19/dependency-management-and-autoloading-in-php-projects-with-composer/">this</a>
    </small>
</blockquote>

### Usage

Let's imagine we want our users to use database authentication (the provided username and password will be checked in a table, for example), and store their data in a simple PHP session.

#### Create the service

This could be the creation of the AuthenticationService.

~~~php
// [...]

// We have passwords hashed with password_hash in the database,
// so we need some application level logic to compare hased and plain passwords
$credentialCallback = function ($passwordInDatabase, $passwordProvided) {
    return password_verify($passwordProvided, $passwordInDatabase);
};

// Create the authentication adapter
/** @var \Zend\Db\Adapter\Adapter $dbAdapter */
$adapter = new \Zend\Authentication\Adapter\DbTable\CallbackCheckAdapter(
    $dbAdapter,
    'users', // Table name
    'username', // Identity column
    'password', // Credential column
    $credentialCallback // This adapter will run this function in order to check the password
);

// Create the storage adapter
$storage = new \Zend\Authentication\Storage\Session();

// Finally create the service
$authService = new \Zend\Authentication\AuthenticationService($storage, $adapter);
~~~

And that would be all we need. That code could be located in some kind of factory or bootstrap script. We could also use a dependency injection container implementation to create the AuthenticationService object.

#### Using the service for authentication

Then, if we need to use the autentication service to perform an authentication, this would be the code. I have created a class that could act as a controller.

~~~php
class MyController
{
    /**
     * @var \Zend\Authentication\AuthenticationService
     */
    protected $authService;

    public function __construct(\Zend\Authentication\AuthenticationService $authService)
    {
        // We should get the previously created AuthenticationService injected
        $this->authService = $authService;
    }

    public function loginAction($username, $password)
    {
        /** @var \Zend\Authentication\Adapter\DbTable $adapter */
        $adapter = $this->authService->getAdapter();
        $adapter->setIdentity($username);
        $adapter->setCredential($password);

        $result = $this->authService->authenticate();
        return $result->isValid() ? 'Login OK!' : 'Wrong username or password';
    }
}
~~~

As you can see, we have to set the identity (usually a username) and the credential (the password) to the adapter wrapped by the AuthenticationService, and then call to the method authenticate.

That method will return a `Zend\Authentication\Result` object which can be used to know if authentication was OK (by calling the `isValid()` method) and get the identity data (by calling `getIdentity()`).

In any case, if authentication was valid, the AuthenticationService will automatically store the identity in the sotrage object.

The identity data contents will depend on the adapter implementation. In the case of the DbTable adapter, it is an array with information of the user's table row.

<blockquote>
    <small>For this tutorial I have avoided the database connection configuration and how we get the username and password.</small>

    <small>If you want to know how to create a database adapter (<code>Zend\Db\Adapter\Adapter</code>) in Zend Framework 2, just read <a href="https://framework.zend.com/manual/2.3/en/modules/zend.db.adapter.html">this article</a>.</small>
</blockquote>

#### Checking a stored identity

Now that we have performed the authentication, in next requests we need to check if the user is already logged in. The AuthenticationService is also capable of that.

Since we set a PHP session storage object, it can look at that storage for a previously persisted identity. If it exists we can assume a user is already logged in.

At some kind of pre-dispatch hook, after any operation that needs atuhentication is preformed, we could do something like this.

~~~php
// [...]

/** @var \Zend\Authentication\AuthenticationService $authService */
if (!$authService->hasIdentity()) {
    $response = new Response();
    $response->setCode(403);
    return $response;
}

// [...]
~~~

The Response object is a fake object I made up just for this example, but it represents that if the user is not logged in we return a 403 error.

We could also redirect him to the login form, that just depends on the situation, but as you can see, the `hasIdentity()` method tells us if some user was logged in.

#### Deleting a stored identity

Finally any user could want to logout from the system. The AuthenticationService allows us to destroy the stored identity by calling `clearIdentity()`, which will make the method `hasIdentity()` to return false in subsequent calls.

Let's extend the previous `MyController` class.

~~~php
class MyController
{
    /**
     * @var \Zend\Authentication\AuthenticationService
     */
    protected $authService;

    public function __construct(\Zend\Authentication\AuthenticationService $authService)
    {
        // We should get the previously created AuthenticationService injected
        $this->authService = $authService;
    }

    public function loginAction($username, $password)
    {
        // [...]
    }

    public function logoutAction()
    {
        $this->authService->clearIdentity();
        return 'User logged out successfully';
    }
}
~~~

And that's pretty much all you can (and probably need) to do with the AuthenticationService.

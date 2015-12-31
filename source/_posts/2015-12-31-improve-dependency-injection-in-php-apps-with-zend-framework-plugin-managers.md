---
title: Improve dependency injection in PHP apps with Zend Framework plugin managers
tags:
    - zf2
    - zend-framework-2
    - dependency-injection
    - di
    - service-manager
    - plugin-manager
categories:
    - php
    - zf2

---

I have spoken many times at this blog about dependency injection, and how the ZF2 ServiceManager is one of the best tools to solve it.
You can find related articles here:



In this article I'm going to speak about another utility that comes with the `Zend\ServiceManager package, the AbstractPluginManager.

### Injecting a service container

Generally it is a very bad practice to inject a service container into any object, but there are some situations where it could be even good, when certain conditions are met. 

In one of the ZF2 mailing lists somebody asked which were these situations. I couldn't find the email, but the answers said that you can do it when the service container manages resources of the same type, and your object virtually depends on all of them. 

For example, imagine you have a database connections pool. It is responsible of creating connection objects, and knowing which one should be returned. 

If you have another object that needs to perform database connections, you don't want to inject all of the connection objects into it, you should rather inject the connection pool. That will reduce the number of dependencies of your object. 

In this situation, the connection pool is some kind of service container, but injecting it has more benefits than disadvantages.

### The AbstractPluginManager implementation

Once we know the theory, we can see how to implement it. 

The AbstractPluginManager is a class that extends the ServiceManager, but includes an abstract method validatePlugin that implementors should use to validate objects when they are created. It just needs to throw an exception if it is not valid, for example because it doesn't implement certain interface.

This way we can be sure that all the services managed by it can be used for a specific task. In the connection pool example, all the managed objects soul be capable of connecting to a database.

### A real example

Imagine that we have a service that needs to connect to different social networks in order to generate social login URLs and get user information from them.
That service abstracts the concrete implementation for each social network, and to do it, it gets concrete social connectors injected.

It could look like this:

~~~php
class SocialUsers
{
    public function __construct(
        FacebookConnector $fConnector,
        TwitterConnector $tConnector,
        LinkedinConnector $lConnector
    ) {
        // [...]
    }
    
    /**
     * @return string
     */
    public function getLoginUrl($socialNetwork)
    {
        if ($socialNetwork === 'facebook') {
            return $this->fConnector->getLoginUrl();
        } if ($socialNetwork === 'twitter') {
            return $this->tConnector->getLoginUrl();
        } if ($socialNetwork === 'linkedin') {
            return $this->lConnector->getLoginUrl();
        }
    }
    
    /**
     * @return array
     */
    public function getUserData($socialNetwork, $authToken)
    {
        if ($socialNetwork === 'facebook') {
            return $this->fConnector->getUserData($authToken);
        } if ($socialNetwork === 'twitter') {
            return $this->tConnector->getUserData($authToken);
        } if ($socialNetwork === 'linkedin') {
            return $this->lConnector->getUserData($authToken);
        }
    }
}
~~~

The service methods call to the proper connector based on the social network we specify. Apparently, it's a simple implementation.

But there is a problem

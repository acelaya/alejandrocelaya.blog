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
    - zf

---

I have spoken many times at this blog about dependency injection, and how the ZF2 ServiceManager is one of the best tools to solve it.
You can read these related articles to know more:

- [How to properly use the Zend framework 2 service manager as a dependency injection container](http://blog.alejandrocelaya.com/2014/07/03/how-to-properly-use-the-zend-framework-2-service-manager-as-a-dependency-injection-container/)
- [Advanced usage of ServiceManager in Zend Framework 2](http://blog.alejandrocelaya.com/2014/10/09/advanced-usage-of-service-manager-in-zend-framework-2/)
- [Managing objects creation and dependency injection with Zend\ServiceManager](http://blog.alejandrocelaya.com/2015/02/06/managing-objects-creation-and-dependency-injection-with-zend-service-manager/)

In this article I'm going to speak about another utility that comes with the `Zend\ServiceManager` package, the `AbstractPluginManager`.

### Injecting a service container

Generally it is a very bad practice to inject a service container into any object, but there are some situations where it could be even good, when certain conditions are met. 

In one of the ZF2 mailing lists somebody asked which were these situations. I couldn't find the email, but the answers said that you can do it when the service container manages resources of the same type, and your object virtually depends on all of them. 

For example, imagine you have a database connections pool. It is responsible of creating connection objects, and knowing which one should be returned. 

If you have another object that needs to perform database connections, you don't want to inject all of the connection objects into it, you should rather inject the connection pool. That will reduce the number of dependencies of your object. 

In this situation, the connection pool is some kind of service container, but injecting it has more benefits than disadvantages.

### The AbstractPluginManager implementation

Once we know the theory, we can see how to implement it. 

The AbstractPluginManager is a class that extends the ServiceManager, but includes an abstract method `validatePlugin` that implementors should use to validate objects when they are created. It just needs to throw an exception if it is not valid, for example because it doesn't implement certain interface.

This way we can be sure that all the services managed by it can be used for a specific task. In the connection pool example, all the managed objects should be capable of connecting to a database.

### A real example

Imagine that we have a service that needs to connect to different social networks in order to generate social login URLs and get user information from them.
That service abstracts the concrete implementation for each social network, and to do it, it gets concrete social connectors injected.

It could look like this:

~~~php
namespace Acelaya\Social;

use Acelaya\Social\Connector\FacebookConnector;
use Acelaya\Social\Connector\LinkedinConnector;
use Acelaya\Social\Connector\TwitterConnector;

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
        } elseif ($socialNetwork === 'twitter') {
            return $this->tConnector->getLoginUrl();
        } elseif ($socialNetwork === 'linkedin') {
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
        } elseif ($socialNetwork === 'twitter') {
            return $this->tConnector->getUserData($authToken);
        } elseif ($socialNetwork === 'linkedin') {
            return $this->lConnector->getUserData($authToken);
        }
    }
}
~~~

The service methods call to the proper connector based on the social network we specify. Apparently, it's a simple implementation.

But there is a problem. If the number of social networks we support grows too much, at some point this service is going to have too many dependencies, and that's a code smell. Also, having a lot of `if` statements per method is not very clean either.

The solution would be to create a `SocialPluginManager`, an object that extends `Zend\ServiceManager\AbstractPluginManager` and manages and creates each social connector transparently. Then, we just need to make the `SocialUsers` service to depend on the `SocialPluginManager`.

Each social connector should implement an interface like this.

~~~php
namespace Acelaya\Social\Connector;

interface SocialConnectorInterface
{
    /**
     * @return string
     */
    public function getLoginUrl();
    
    /**
     * @return array
     */
    public function getUserData($authToken);
}
~~~

Then the `SocialPluginManager` will just need to check if any created object implements it.

~~~php
namespace Acelaya\Social;

use Acelaya\Social\Connector\SocialConnectorInterface;
use Zend\ServiceManager\AbstractPluginManager;
use Zend\ServiceManager\Exception;

class SocialPluginManager extends AbstractPluginManager
{
    /**
     * Validate the plugin
     *
     * Checks that the filter loaded is either a valid callback or an instance
     * of FilterInterface.
     *
     * @param  mixed $plugin
     * @return void
     * @throws Exception\RuntimeException if invalid
     */
    public function validatePlugin($plugin)
    {
        if ($plugin instanceof SocialConnectorInterface) {
            return;
        }
        
        throw new Exception\RuntimeException(sprintf(
            'Plugins managed by "%s" must implement "%s". "%s" provided',
            __CLASS__,
            SocialConnectorInterface::class,
            is_object($plugin) ? get_class($plugin) : gettype($plugin)
        ));
    }
}
~~~

We now need to refactor the `SocialUsers` service so that it depends on the `SocialPluginManager`.

~~~php
namespace Acelaya\Social;

use Acelaya\Social\Connector\SocialConnectorInterface;
use Acelaya\Social\Exception\InvalidSocialNetworkException;

class SocialUsers
{
    public function __construct(SocialPluginManager $socialPlugins)
    {
        // [...]
    }
    
    /**
     * @return string
     */
    public function getLoginUrl($socialNetwork)
    {
        return $this->getSocialConnector($socialNetwork)->getLoginUrl();
    }
    
    /**
     * @return array
     */
    public function getUserData($socialNetwork, $authToken)
    {
        return $this->getSocialConnector($socialNetwork)->getUserData($authToken);
    }
    
    /**
     * @return SocialConnectorInterface
     */
    protected function getSocialConnector($socialNetwork)
    {
        if (! $this->socialPlugins->has($socialNetwork)) {
            throw new InvalidSocialNetworkException($socialNetwork);
        }
        
        return $this->socialPlugins->get($socialNetwork);
    }
}
~~~

The resulting code is much cleaner, and now we can add any new social network without having to change the `SocialUsers` service. We just need to create and register the new social connector.

The last thing we have to do is defining the `SocialPluginManager` configuration. Since the `AbstractPluginManager` extends the `ServiceManager`, it is exactly the same as the one used for it. To make the previous code work, we have to use the social network name as the service name for each connector, so the configuration could look like this.

~~~php
use Acelaya\Social\Connector;

return [
    'factories' => [
        'facebook' => Connector\FacebookConnectorFactory::class,
        'twitter' => Connector\TwitterConnectorFactory::class,
        'linkedin' => Connector\LinkedinConnectorFactory::class,
    ]
];
~~~

I have used factories as an example, but you can use any valid strategy you want.

You can see a small example project [here](https://github.com/acelaya-blog/di-with-plugin-manager). The concrete social connector doesn't do nothing, but you can see how they work.

The plugin managers are widely used in `Zend\Mvc` for tasks like this. The controller plugins, view helpers, form elements and such can all be managed by its own plugin managers.

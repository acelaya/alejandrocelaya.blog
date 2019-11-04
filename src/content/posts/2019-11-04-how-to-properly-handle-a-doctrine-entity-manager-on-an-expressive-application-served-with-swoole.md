---
layout: post
title: "How to properly handle a doctrine entity manager on an expressive application served with swoole"
categories: [php]
tags: [swoole,expressive,zend-expressive,doctrine,di,dependency-injection,factory]
---

Some of you probably know that I have a pet project in which I like to work from time to time. This project is a self-hosted URL shortener called [Shlink](https://shlink.io).

Shlink is built using expressive as the base framework for the HTTP-dispatching task. A while ago, an expressive module was released to officially support serving expressive apps with [swoole](https://www.swoole.co.uk/), and I decided to include it on Shlink.

### How does swoole work?

Swoole is an asynchronous non-blocking I/O framework which works in a similar way as node.js, but for PHP apps.

It has been conceived in a way that the app stays in memory between requests, removing the bootstrapping step and making apps to be served much faster.

Swoole can serve as many simultaneous requests as you tell it to. For this it makes use of workers. Each worker can serve one request at a time, and every worker has a separated instance of the app loaded in memory (this is something I [learned recently](https://twitter.com/dominikzogg/status/1189403552399134720)).

Because of this, you have to sometimes change a bit the way you design your code. For example, if a service needs to be stateful (it shouldn't, but shit happens), you will have to remember that the state will persist between requests, and you will want to somehow reset it to avoid unexpected side effects.

### How does this affect the EntityManager?

One of the main services that keeps this internal state in Shlink is the doctrine [EntityManager](https://www.doctrine-project.org/projects/doctrine-orm/en/current/tutorials/getting-started.html#obtaining-the-entitymanager).

Because it was originally designed to be used on a classical web server + CGI context, assuming it would be recreated on every request, there are a few considerations to take into account:

* It implements the unit of work pattern. It internally keeps track of all the entities that have been created/changed until you decide to flush it.
* If something fails, the `EntityManager` can get closed, which makes it unusable after that moment.
* If the database connection expires, the `EntityManager` will not gracefully recover. Instead, it will fail, since it's not aware of the connection not being usable, getting yourself in previous point.

### How to workaround it

I learned about these issues by try and error, by using it on the app and getting the failures. Now, I want to share how I workaround those issues.

The first one I faced was the one making the app unusable after the `EntityManager` was closed. In order to solve this I created a decorated instance (naming, an object implementing `EntityManagerInterface` which in turn was wrapping an actual `EntityManager`), which was making sure the wrapped instance was transparently recreated if at some point it was closed.

However, this caused some side effects, and I finally realized that it was better to make the `EntityManager` to have to be reopened from the outside, and only once per request (this is closer to how it would behave on a classical set-up).

That's how I came up with the `ReopeningEntityManager` Shlink is currently using (as of v1.20.0):

```php
<?php

declare(strict_types=1);

namespace Shlinkio\Shlink\Common\Doctrine;

use Doctrine\ORM\Decorator\EntityManagerDecorator;

class ReopeningEntityManager extends EntityManagerDecorator
{
    /** @var callable */
    private $createEm;

    public function __construct(callable $createEm)
    {
        parent::__construct($createEm());
        $this->createEm = $createEm;
    }

    public function open(): void
    {
        if (! $this->wrapped->isOpen()) {
            $this->wrapped = ($this->createEm)();
        }
    }
}
``` 

> You can find the actual code in [shlink-common](https://github.com/shlinkio/shlink-common/blob/master/src/Doctrine/ReopeningEntityManager.php).

It just expects a factory that creates the actual `EntityManager`, and exposes an `open` public method which re-creates the wrapped instance if closed.

This method is called from an expressive middleware which needs to be registered early in the middleware pipeline. It makes sure the method is called before the next middleware on the stack is invoked:

```php
<?php

declare(strict_types=1);

namespace Shlinkio\Shlink\Common\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Shlinkio\Shlink\Common\Doctrine\ReopeningEntityManager;

class CloseDbConnectionMiddleware implements MiddlewareInterface
{
    /** @var ReopeningEntityManager */
    private $em;

    public function __construct(ReopeningEntityManager $em)
    {
        $this->em = $em;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $this->em->open();

        try {
            return $handler->handle($request);
        } finally {
            $this->em->getConnection()->close();
            $this->em->clear();
        }
    }
}
```

> Again, the code can be found in [shlink-common](https://github.com/shlinkio/shlink-common/blob/master/src/Middleware/CloseDbConnectionMiddleware.php)

This middleware also does two more things, this time, after calling the next middleware on the stack, and making sure it does it even if an exception is thrown.

* It first closes the database connection. By doing it so, we make sure the `EntityManager` will reconnect the next time it needs to interact with the database, and therefore, we avoid the "expired connection" issue.
* Then it clears the `EntityManager` itself. This avoids memory leaks, and also prevents that any orphan/non-flushed entity "transcends" to the next request, solving the other two problems.

### Further considerations

This approach has been working well so far, but it's important to assume that the `EntityManager` was not really designed for this non-blocking kind of context.

You need to know that the worker making use of it will not be able to serve any request until the `EntityManager` finishes its job. Because of this you might want to increase the number of swoole workers.

Also, closing the DB connection on every request is not the most optimal approach. It would be perfect to have a connection pool that was able to recreate connections when expired, and to keep them open as long as possible for faster operations. However, the `EntityManager` was not designed for that, so it's better to close it.

You also need a `callable` to pass to the `ReopeningEntityManager`. The way you solve this depends on your implementations and the dependencies you use.

In my case, in Shlink I make use of the `ServiceManager`, so I have a delegator factory which takes the actual factory and passes it to the `ReopeningEntityManager`:

```php
<?php

declare(strict_types=1);

namespace Shlinkio\Shlink\Common\Doctrine;

use Psr\Container\ContainerInterface;

class ReopeningEntityManagerDelegator
{
    public function __invoke(ContainerInterface $container, string $name, callable $createEm): ReopeningEntityManager
    {
        return new ReopeningEntityManager($createEm);
    }
}
```

> You can find the actual code in [shlink-common](https://github.com/shlinkio/shlink-common/blob/master/src/Doctrine/ReopeningEntityManagerDelegator.php).

### Conclusion

I wanted to write this article as a recap for myself too, since I had to ask and investigate many times, and I couldn't find a single source of truth explaining everything.

I hope that, if you ended up here, this article served you well.

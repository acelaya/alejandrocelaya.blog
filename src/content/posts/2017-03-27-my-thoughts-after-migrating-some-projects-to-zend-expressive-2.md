---
layout: post
title: "My thoughts after migrating some projects to Zend Expressive 2"
categories: [php,zf]
tags: [zend-expressive,psr-7,psr-15,middleware,zf3,microframework,migration]
---

The day Zend Expressive 2 was released I was super excited. I have been using it a lot for both professional and personal projects, so I'm quiet used to it.

Since I've been using it in many projects, being able to update all of them to version 2 was a challenge, but I can say, I have succeed :-)

### The projects

I have used expressive for two small websites, [https://www.alejandrocelaya.com](https://www.alejandrocelaya.com) and [https://shlink.io](https://shlink.io).

The code can be found [here](https://github.com/acelaya/alejandrocelaya.com) and [here](https://github.com/shlinkio/shlink.io).

When I migrated my website to expressive, I had to create a custom router for backward compatibility reasons, because none of the provided implementations supports optional params at the beginning of the path, and I was using them.

That's why I created [this](https://github.com/acelaya/expressive-slim-router) implementation based on Slim framework router (Slim 2, not 3). Since expressive 2 depends on the expressive router 2, I had to release a new version of this component too.

The next project to migrate was [Shlink](https://github.com/shlinkio/shlink), a little OSS project of my own. Like its website, it is based on expressive too.

This is a little bit bigger application, but not too big anyway.

Shlink is mainly a REST API, but has two or three endpoints that are meant to be consumed by humans in a web browser. For this reason I created a component that was responsible of handling errors in a different way, depending on the request's `Accept` header.

Since the concept of error handling has completely changed in expressive 2, that library needed to be updated too: [https://github.com/acelaya/ze-content-based-error-handler](https://github.com/acelaya/ze-content-based-error-handler)

And I left the two most important projects for the end.

First, my company's website. Another small project, not too hard to migrate.

Finally, my company's main product. A big and modular REST API, with about 100 actions/middlewares I wanted to migrate to [http-interop middleware](https://github.com/http-interop/http-middleware). It wasn't difficult, but it took me a while to fix all tests xD.

In the end I migrated **5** projects and **2** libraries, and I am quite proud of the result.

### The process

When I decided to migrate the first project, I started by following this article from the official documentation: [https://docs.zendframework.com/zend-expressive/reference/migration/to-v2/](https://docs.zendframework.com/zend-expressive/reference/migration/to-v2/).

It has a very detailed explanation with everything you need to know. Indeed, the best achievement of the Zend Framework team has been the number of articles, tools and documentation they provide to make this migration easier.

They have also spent a lot of time on making as many features as possible, backward compatible, to the point that almost everything keeps working after updating the components.

My conclusion after reading the article was that the only two things I needed to fix was the error handler and the middlewares signature, to use the single-pass approach instead of the old double-pass. However, the second one is not really necessary, since double-pass middleware keeps working with expressive 2, but I wanted to change it.

### Error handler

At first, when one reads the docs, it seems that changing the error handler is going to be hard.

They explain the idea behind the new approach, why they have changed it, and how you should implement it.

The fact is that after reading this you realize expressive 2 and stratigility 2 come with a basic implementation that makes migrating from the old error handler to the new approach as easy as registering two services and one middleware. Done.

Now, instead of having a component that gets called when the middleware stack gets exhausted or an exception is thrown, like in expressive 1, the recommendation is to register a middleware at the outermost layer of the stack, that is responsible of catching any exception thrown by any inner middleware. Basically, what you do is invoke the next middleware inside a try/catch, and return an error response if the catch block is reached.

Stratigility 2 comes with a `Zend\Stratigility\Middleware\ErrorHandler` middleware that already does this. Just pipe it at the beginning of the stack and register the service using the provided `Zend\Expressive\Middleware\ErrorHandlerFactory` factory.

In expressive 1, the error handler was responsible of returning a response object. Now, this new ErrorHandler middleware delegates this responsibility into a service called ErrorResponseGenerator. Stratigility comes with an implementation, the `Zend\Stratigility\Middleware\ErrorResponseGenerator` that returns plain text errors, like the old stratigility ErrorHandler used to do.

On the other hand, expressive comes with two implementations, the `Zend\Expressive\Middleware\ErrorResponseGenerator`, which gets a template renderer injected, and acts like the old `TemplatedErrorHandler`, and also, a `Zend\Expressive\Middleware\WhoopsErrorResponseGenerator`, which is meant to be used in development, and acts like the old `WhoopsErrorHandler`.

In other words, in order to migrate the error handler, you just need to do three things:

* Remove the old `Zend\Expressive\ErrorHandler` service
* Register both `Zend\Stratigility\Middleware\ErrorHandler` and `Zend\Expressive\Middleware\ErrorResponseGenerator`, with whichever implementation you want.
* Pipe the `Zend\Stratigility\Middleware\ErrorHandler` middleware as the outermost middleware of your stack.

After doing this, everything should work.

### Error middleware

Expressive 1 had a feature called error middleware.

These middlewares were not exactly the same as regular middleware. Instead, they received a fourth `error` param, and were piped at the end of the stack, so they were invoked only if the latest regular middleware called the next one, or any other middleware called next with an `error` parameter, which had the effect of bypassing any other regular middleware and jumping directly to the first error middleware.

I never liked this feature, because it wasn't clear.

* What if I pipe error middleware between regular middleware, with a higher priority? Does it get invoked?
* Why error middleware doesn't get invoked in case of status 404 or 405? Isn't that an error? Apparently not.
* What is an "error" in the scope of middleware then? An exception only?

Because I was never sure how to use error middleware, I decided to reduce it to the point that only one of the projects had one error middleware that was responsible of logging exceptions in a file.

Gladly, the new error handling approach, the `Zend\Stratigility\Middleware\ErrorHandler`, allows "error" listeners to be attached, so that when an exception is caught, the error can be processed by any number of listeners.

The signature of the listeners is the same as the error middlewares used to have. Invokable objects with three parameters, an error, a request and a response.

This allowed me to register that error middleware as a listener, and just remove the return statement, which is no longer used.

### Single-pass middleware

One of the most important new features in expressive 2, and the one I most wanted to use, is the support for interop middleware. It is what has been proposed to end up as the [psr-15](https://github.com/php-fig/fig-standards/blob/master/proposed/http-middleware/middleware.md) standard for server middleware.

The main difference with middleware in expressive 1 is that middlewares no longer get the response object (which is less error prone), and that the last argument is no longer a `callable`, but an object (the **delegate**) which invokes the next middleware and returns the response generated by it.

Migrating middlewares to this approach is very easy. Remove the second argument and replace `$out($request, $response)` by `$delegate->process($request)`. Done.

The hardest part here is migrating tests.

Since expressive 1 middlewares are `callables`, I used to use `Closures` in tests. Now, the last argument is type hinted to `DelegateInterface`, so you have to explicitly mock it.

I have used [prophecy](https://github.com/phpspec/prophecy), which comes with PHPUnity, and it works like a charm. It's not very difficult, but it could take a while if the application is big.

Of course, If you don't test your code, you won't have this problem, but I hope it is not your case ;-)

Tests allowed me to be sure all middlewares and actions were still working, before testing the apps manually.

### Router

Changes in the router shouldn't affect you, unless you have implemented your own router, like me.

However, the change is very small. This is what I had to change: [feature/v3](https://github.com/acelaya/expressive-slim-router/commit/46bb000cb4389a6be6bff1335f875d7c6d8f5ca9)

You could also be affected by this if you rely on the `RouteResult` in any of your middlewares and used to call `RouteResult::fromRouteMatch()` in tests. Just replace it by `RouteResult::fromRoute()` and that's it.

### Programmatic approach

Another of the changes in expressive 2 is that now they promote the programmatic approach to configure routes and pipe middlewares, because newcomers find it easier to understand.

However, the config-driven approach still works, and you can still use it if you want.

That's my case indeed. I like having my modules provide different routes, instead of defining all of them in a single config file. It better fits my workflow and my way of thinking.

Something similar happens with middleware, I prefer defining it in a config file with array notation. However, I have to confess I have moved all the middleware config to a single file in all projects. 

I have found that, as the project grows, since middleware needs to be piped in a specific order, defining it in different files makes it harder to maintain and much more error prone. This is probably one of the reasons of promoting the programmatic approach.

### Conclusion

My conclusion after migrating all these projects is that expressive is a great framework, and the Zend Framework team is expending a lot of time to make it scalable, maintainable an usable.

The more I use it, the more I see it is the best option for projects of any size. A framework where everything is perfectly explained, with a really good documentation, very loosely coupled with any other component, and a framework where you always have the last word.

No black magic or obscure conventions. But at the same time, you can quickly prototype any application without writing a lot of boilerplate code.

Thanks to all of this, the migration between major versions has been a breeze.

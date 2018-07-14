---
layout: post
title: "Demonstrating the interoperability and decoupling of Zend Expressive"
categories: [php,zf]
tags: [expressive,zf,interoperability]
---

I have written a lot of posts about Zend Framework in general and Zend Expressive in particular, but I have noticed that I have never talked about one of the things that makes Expressive so game-changing to me, **Interoperability**.

### Some context

In the past, PHP frameworks used to be very big libraries, which tried to provide solutions to any possible problem in order to retain users.

At that time, you had to decide which framework you wanted to use, by weighing pros and cons. People ended saying "I prefer framework *foo*, because it has a better templating system", "ok, but framework *bar* has a better performance and its dependency injection approach is delightful".

It wasn't easy to pick the best part of every framework (or the parts you liked the most) and be able to use them in the same project.

Because of this, the [PHP Framework Interop Group](https://www.php-fig.org/) was born (PHP-FIG from now on). Its goal was to define standard recommendations that frameworks and libraries could adhere to.

At some point this would mean that frameworks would use compatible APIs in their different components and people would be able to easily change one specific component by another.

### Expressive's interoperability

Mostly all frameworks which are part of the PHP-FIG have more or less adopted these standard recommendations. If you have been working with PHP in the last 3-4 years, you know it is now much more easier to "mix" libraries and frameworks in the same project.

However, the one which has been capable of making interoperability part of its essence is [Zend Expressive](https://docs.zendframework.com/zend-expressive/) (probably because it was born in that period and it was one of the main design goals).

Expressive itself does not provide solutions to almost nothing. Instead, it relies in a series of interfaces and abstractions in order to get everything working.

* It is a middleware-based framework, so it expects your middlewares and actions (request handlers) to implement [PSR-15](https://www.php-fig.org/psr/psr-15/) interfaces. This way, your own code is not coupled with Expressive at all.
* In order to dispatch this middleware they use a middleware dispatcher, [Zend Stratigility](https://docs.zendframework.com/zend-stratigility/) in this case, which also implements PSR-15's request handler interface.
* It is also a web framework, so it needs to dispatch HTTP requests. For this, it expects you to include a library implementing [PSR-7](https://www.php-fig.org/psr/psr-7/). They provide one implementation, [Zend Diactoros](https://docs.zendframework.com/zend-diactoros/), but you can use whatever you want.
* Expressive promotes Dependency Injection, so it expects a dependency injection container to be present. Once again, they expect any container implementing [PSR-11](https://www.php-fig.org/psr/psr-11/), so you can use the container of your choice and everything will work.

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

Because of this, the [PHP Framework Interop Group](https://www.php-fig.org/) was born. Its goal was to define standard recommendations that frameworks and libraries could adhere to.

At some point this would mean that frameworks would use compatible APIs in their different components and people would be able to easily change one specific component by another.

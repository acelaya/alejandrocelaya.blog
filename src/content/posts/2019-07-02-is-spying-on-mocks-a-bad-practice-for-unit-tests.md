---
layout: post
title: "Is spying on mocks a bad practice for unit tests?"
categories: [tools]
tags: [tests,checks,automated-checks,unit-testing,mocks,tdd]
---

For a long time, I have been trying to include tests in every project in which I've worked on.

There are several types of automated tests (or what should actually be called [automated checks](https://abstracta.us/insights/guide-continuous-testing/automated-checks)). From unit tests, to integration and functional tests, to end-to-end tests.

Each one of them differs from the rest by the scope they try to cover. From small units of code which are tested completely detached from external dependencies, to a whole app which is tested as a black box like if an end consumer was using it.

I'm not going to deeply discuss the semantics behind this, or where an integration test ends and an end-to-end test starts, because it's quite frequently a blurry line.

I want to focus on unit tests, and a practice which I find very usually (even in my own tests), but I have read (and felt) several times, it's not the best approach.

> This article is not focused on any specific technology, since I have found this in many kinds of projects.

### What's really a unit test

According to [Wikipedia](https://en.wikipedia.org/wiki/Unit_testing), unit testing is a "method by which individual units of source code [...] are tested to determine whether they are fit for use".

While this might look like a clear definition, it's actually quite open, because what is a "unit" in the context of unit testing.

Very often, in object oriented programming projects, people take a class as a unit to test, and create a unit test for every class. In other paradigms, like functional programming, you might consider a function as the unit to be tested, or a set of functions which you have decided to put together in a module.

This is not really important for the purpose oif this article. What's really important is to take into account that, in order to properly "unit test" a "unit of source code", you have to do it by isolating it from any dependency of that unit.

In order to do it, it's important that you follow the **[Dependency Injection Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)**, or you will end up trying to hack yourself to detach a "unit" from its dependencies.

> You can find other articles about [Dependency Injection](https://blog.alejandrocelaya.com/tag/dependency-injection/) in my blog.

### Replacing dependencies



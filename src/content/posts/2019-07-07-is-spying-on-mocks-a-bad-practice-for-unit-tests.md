---
layout: post
title: "Is spying on mocks a bad practice for unit tests?"
categories: [tools]
tags: [tests,checks,automated-checks,unit-testing,mocks,tdd]
---

For a long time, I have been trying to include tests in every project in which I've worked on.

There are several types of automated tests (or what should actually be called [automated checks](https://abstracta.us/insights/guide-continuous-testing/automated-checks)). From unit tests, integration and functional tests, to end-to-end tests.

Each one of them differs from the rest by the scope they try to cover. From small units of code which are tested completely detached from external dependencies, to a whole app which is tested as a black box like if an end consumer was using it.

I'm not going to deeply discuss the semantics behind this, or where an integration test ends and an end-to-end test starts, because it's quite frequently a blurry line.

I want to focus on unit tests, and a frequently used practice (even in my own tests), which I have read (and felt) several times, it might not be the best approach.

> This article is not focused on any particular technology, since I have found this in a lot of different projects.

### What's a unit test

According to [Wikipedia](https://en.wikipedia.org/wiki/Unit_testing), unit testing is a "method by which individual units of source code [...] are tested to determine whether they are fit for use".

While this might look like a clear definition, it's actually quite open because, what's a "unit" in the context of unit testing?

Very often, in object oriented programming projects, people take a class as a unit to test, and create a unit test for every class. In other paradigms, like functional programming, you might consider a function as the unit to be tested, or a set of functions which you have decided to put together in a module.

This is not really important for the purpose of this article. What's really important is to take into account that, in order to properly "unit test" a "unit of source code", you have to do it by isolating it from any dependency of that unit.

One of the better ways to achieve this is by following the **[Dependency Injection Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)**. Without it you will probably end up trying to hack yourself in order to detach a "unit" from its dependencies.

> You can find other articles about [Dependency Injection](https://blog.alejandrocelaya.com/tag/dependency-injection/) in my blog.

### Replacing dependencies

A very frequent practice when unit testing a unit of source code is to replace its dependencies with [test doubles](https://en.wikipedia.org/wiki/Test_double), in order to properly isolate every unit when testing it.

Test doubles are basically objects compatible with the dependencies of the subject under test, that are created just for the purpose of the test and have some useful capabilities, like capturing how they have been called, or what should they return when called.

When you use one of those test doubles to assert how they were called as part of the test itself, you are using them as "spies".

### Over-trusting spies

All this introduction and contextualization had a single purpose.

I find myself (and others) in the situation in which you prepare a test double to behave in a certain way, then you call your subject under test, and then assert that your expectations on how the test double was called are correct, by spying on it.

This sometimes feels wrong, since it seems you are testing the test double/s instead of the subject under test.

I have read many times that, in a unit test, we should not actually know the internal implementation of the subject under test, but only test that, based on certain input, the expected output is returned (so, trust its public API).

However, there are cases in which some function/method does not really have any output, and we can only verify everything is going right by spying on the test doubles.

So, at the end of the day, I have mixed feelings about this practice.

### Conclusion

Sadly, I cannot state a clear conclusion. This is actually an open article, and I would love to get your point of view in the form of a [comment](#comments-box).

It would be great to see how others face this, if you use other kinds of test doubles instead of spies, or if you are just ok with the implications.

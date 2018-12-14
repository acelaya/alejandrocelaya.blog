---
layout: post
title: "Dependency injection in nodejs projects"
categories: [web]
tags: [js,javascript,node,nodejs,dependency-injection,dependency-injection-container,dic,di]
---

It's been a while since the last time I wrote a non-PHP programming related article.

Some of you know that I work professionally now as a full stack javascript developer, and I have interacted with a few different projects, both in front-end javascript and in nodejs.

My main concern about javascript has been that, apparently, the community has not adopted one of the practices that, for me, has been the most game changing of all: **Dependency Injection**.

Since I adopted true dependency injection, all my projects have drastically improved, and not being able to have a proper way to bring this to javascript has made me feel kind of lost.

> Take into account that this is my relative point of view, from a community which is still quite new to me, so if you find that something I say makes no sense at all, you are more than welcome to [leave a comment](#disqus_thread).

### Current state of DI in JS

At the moment of writing this article, I have made some research, and my feeling is that only very strict object-oriented projects based on `Typescript` introduce the concept of Dependency Injection.

Frameworks like [`Angular`](https://angular.io/) and [`NestJS`](https://nestjs.com/) include dependency injection containers which allow us solving the dependency injection problem in a more than decent way.

However, these solutions force us to write a code which feels too coupled with the framework.

I have also found what seems to be a pretty popular framework-agnostic dependency injection container, [`InversifyJS`](http://inversify.io/), which again, seems to be more `Typescript` oriented (despite the fact that it says it's for plain javascript as well).

From my point of view, the main problem with this one is that its too complex to get it up and running, which makes people get tired of even trying dependency injection.

Other than this, I have not seen much adoption in plain javascript projects (maybe more functional than object-oriented), where developers just import or require the dependencies to be used from other modules and use them, which couples the code and makes it really hard to test (at least unit test).

### Good dependency injection

I want to first try to define the way I feel dependency injection should be, so that it is flexible and useful, and not scary to use:

* We should be able to write code in javascript modules in a way we don't care where our dependencies come from, or how are they going to be created.

    I have seen some attempts in which dependencies are imported or required in the code, but then the module exports some way to override the dependency at runtime (with the intention to do it in tests).

    This is a sort of working approach, but it feels hacky. It's also always importing external code which could have other side effects.

* We should never be forced to couple our own code with the dependency injection framework. At some point we could want to change the implementation, and that shouldn't make us change our code.
* The dependency injection container (which is the object which encapsulates how dependencies are created and injected into objects, **DIC** from now on), should never leak into our code.

    It belongs to bootstrapping scripts and no more. It is also acceptable to get it in code which only purpose is creating objects in the context of dependency injection itself.

    By importing or requiring the DIC, we are hiding the module's dependencies, and ending up with the ugly service locator anti pattern.

* Configuring the DIC should always be an easy task. We should be able to just provide simple configuration or simple factories for the case in which some custom code is needed.

    When the DIC is hard to configure or too feature-bloated, people end up with the feeling that dependency injection is not worth it.

With all this in mind, I have created a proof of concept [`express.js`](https://expressjs.com/)-based project which makes use of a very simple custom DIC to solve dependency injection.

You can find it [here](https://github.com/acelaya-blog/dependency-injection-container-js).

### Explaining the proof of concept.

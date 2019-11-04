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

Swoole can serve as many simultaneous requests as you tell it to. For this it makes use of workers. Each worker can serve one request at a time (more or less, we'll see more on this later), and every worker has a separated instance of the app loaded in memory.

Because of this, you have to sometimes change a bit the way you design your code. For example, if a service needs to be stateful (it shouldn't, but shit happens), you will have to remember that the state will persist between requests, and you will want to somehow reset it to avoid unexpected side effects.

### How does this affect the EntityManager?

One of the main services that keeps this internal state in Shlink is the doctrine [EntityManager](https://www.doctrine-project.org/projects/doctrine-orm/en/current/tutorials/getting-started.html#obtaining-the-entitymanager). These are some of the side effects that I had to face

It implements the unit of work pattern, and keeps track of all the entities that have been created/changed until you decide to flush it.

Not only that, if something fails, the EntityManager can get closed, which makes it unusable after that moment.

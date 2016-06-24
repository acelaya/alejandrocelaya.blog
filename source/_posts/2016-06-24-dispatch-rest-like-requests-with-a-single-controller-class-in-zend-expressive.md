---
title: Dispatch REST-like requests with a single controller class in Zend Expressive
tags:
    - zend-expressive
    - rest
    - dispatch
    - zf3
categories:
    - php
    - zf

---

I was digging into Zend Expressive and how to use controllers that allow me to share dependencies between different routes, instead of having to use different middlewares every time.

[Abdul](https://samsonasik.wordpress.com/) wrote a great article on this subject that you can find [here](https://samsonasik.wordpress.com/2016/01/03/using-routed-middleware-class-as-controller-with-multi-actions-in-expressive/), which also became part of [Expressive's cookbook](http://zendframework.github.io/zend-expressive/cookbook/using-routed-middleware-class-as-controller/) some time later.

This is a perfect approach that easily allows to reuse some code, but then I thought how to do something similar in a rest environment, having a single class with different dispatchable methods that will be called depending on the request's HTTP method.

This is a possible solution based on ZF2's [AbstractRestfulController](https://github.com/zendframework/zend-mvc/blob/master/src/Controller/AbstractRestfulController.php)

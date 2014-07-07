---
title: How to prepare the Zend Framework 2 Certified Architect exam
tags:
    - certification
    - exam
    - zend framework 2
    - zf2
    - zend certified engineer
    - zend framework 2 certified architect
categories:
    - php
    - tools

---

Last week I passed the [Zend Framework 2 Certified Architect](http://www.zend.com/en/yellow-pages/ZEND021590) exam.

I will try to explain how did I prepare it.

### Studying

n late March I recived an email that my exam was going to be on May the seventh, so I saw that I was going to have 4-6 weeks to prepare it. I could have started earlier, but maybe I’m a little lazy.

Since this was one of the first times the Zend Framework certification exam was based on version 2 (2.2), there was no documentation or examples in the internet, so I decided to just read the whole [documentation](http://framework.zend.com/manual/2.2/en/user-guide/overview.html). I was working with Zend Framework 2 in my job, so I could apply the theory in real projects.

My main problem was that I needed to compatibilize the study with my work, so I started studying about an hour a day. Some days I didn’t studied, but some weekends I could spend more time on it.

About two weeks after I started I saw I wasn’t going to be able to read all the documentation, so I started to read the components documentation in order of importance. This finally was proved to be a good system. I got no questions in my exam about `Zend\Barcode`, `Zend\Debug`, `Zend\Navigation` and such trivial components, but plenty of questions about `EventManager`, `ServiceManager`, `ModuleManager`, `Mvc` and `Forms`.

I neither had any questions of ZendService components.

### Questions

The `ServiceManager` was present in many questions, as well as any kind of plugin manager (`ControllerManager`, `ViewHelperManager`…)

In those questions a piece of code was present where many services were registered in different ways, from a plain PHP array, from a `Zend\ServiceManager\Config` object or directly by calling methods from a `ServiceManager` instance.

Then the `ServiceManager` instance was used to retrive services, and you were supposed to know which ones were the same instance, what type of object do they return or even which services return the same instance.

The `EventManager` was also present in many forms. In some questions you were supposed to know the difference between the `EventManager` and the `SharedEventManager`, how to attach listeners or how to use `ListenerAggregates`.

The `MvcEvent` appeared in many questions too, where you need to know about the `EventManager` and the `MVC` layer.

A good bunch of questions was related with Forms, Validators and Filters.

In those questions you may be asked about the `FormElementManager`, get an element where some filters were attached and know which would be the final output from a specific input, or get a form with many elements with validators and know if an input was going to make the form valid or not.

These was the most important parts, but I also had questions about `Hydrators`, `Zend\Db`, the `ModuleManager` and how Modules are loaded, `Zend\View` with its events layer and the `PhpRenderer`, `Zend\I18n`, `Zend\Cache` or `Zend\Config`.

### Conclusions

I made the exam with two other people I knew. The three of us thought that it wasn’t a very complicated exam, with no tricky questions (like `$foo = "Bar"; echo $fo;`), but you have to know the theory very well, how the framework works and how it is supposed to be used.

It is important to know about factories, dependency injection and good practices.

It would be good to work with Zend Framework 2 as long as you study, because that shows you how it behaves in real environments. Sometimes the Albums tutorial is not enough.

I hope this article helps to anyone preparing the exam. I wish you luck.

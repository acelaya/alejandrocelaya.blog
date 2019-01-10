---
layout: post
title: "Dependency injection in nodejs projects"
categories: [web]
tags: [js,javascript,node,nodejs,dependency-injection,dependency-injection-container,dic,di]
---

Some of you know that I work now as a full stack javascript developer, and I have interacted with a few different projects, both in front-end javascript and in nodejs.

My main concern about javascript has been that, apparently, the community has not adopted one of the practices that, for me, has been the most game changing of all: **Dependency Injection**.

> Take into account that this is my relative point of view, from a community which is still quite new to me, so if you find that something I say makes no sense at all, you are more than welcome to [leave a comment](#comments-box).

### Current state of DI in JS

At the moment of writing this article, I have made some research, and my feeling is that only very strict object-oriented projects based on `Typescript` introduce the concept of Dependency Injection.

Frameworks like [`Angular`](https://angular.io/) and [`NestJS`](https://nestjs.com/) include dependency injection containers which allow us solving the dependency injection problem in a more than decent way.

However, these solutions force us to write a code which feels too coupled with the framework.

I have also found what seems to be a pretty popular framework-agnostic dependency injection container, [`InversifyJS`](http://inversify.io/), which again, seems to be more `Typescript` oriented (despite the fact that it says it's for plain javascript as well).

From my point of view, the main problem with this one is that its too complex to get it up and running, which makes people get tired of even trying dependency injection.

Other than this, I have not seen much adoption in plain javascript projects (maybe more functional than object-oriented), where developers just import or require the dependencies to be used from other modules and use them, which couples the code and makes it really hard to test (at least unit test).

### Good dependency injection

I want to start by trying to define how I feel dependency injection should be done, so that it's flexible and useful, and not scary to use:

* We should be able to write code in javascript modules in a way we don't care where our dependencies come from, or how are they going to be created.

    I have seen some attempts in which dependencies are imported or required in the code, but then the module exports some way to override the dependency at runtime (with the intention to do it in tests).

    This is a sort of working approach, but it feels a little bit hacky. It's also always importing external code which could have other side effects.

* We should never be forced to couple our own code with the dependency injection framework. At some point we could want to change the implementation, and that shouldn't make us change our code.
* The dependency injection container (which is the object which encapsulates how dependencies are created and injected into objects, **DIC** from now on), should never leak into our code.

    It belongs to bootstrapping scripts only. It is also acceptable to get it in code which only purpose is creating objects in the context of dependency injection itself.

    By importing or requiring the DIC inside modules, we are hiding the module's dependencies, and ending up with the ugly service locator anti pattern.

* Configuring the DIC should always be an easy task. We should be able to just provide simple configuration or simple factories for corner cases in which a basic config is not enough.

    When the DIC is hard to configure or too feature-bloated, people end up with the feeling that dependency injection is not worth it.

* The DIC should be able to recursively resolve dependencies. We shouldn't need to know what are the dependencies of our dependencies. When creating an object, it should be enough to just pull its direct dependencies from the container, and it should know how to recursively resolve the rest.

With all this in mind, I have created a proof of concept [`express.js`](https://expressjs.com/)-based project which makes use of a very simple custom DIC to solve dependency injection.

You can find the project [here](https://github.com/acelaya-blog/dependency-injection-container-js).

### Explaining the proof of concept

The project is pretty simple. You can just clone it and then run `npm install && node server.js`. It will serve the app in [localhost:3000](http://localhost:3000).

The default path just displays a "Hello World" message, and it has a second [/users](http://localhost:3000/users) path which returns a JSON response where some data is dynamically generated. You can refresh the page in order to see it.

The main characteristic of this project is that, if you open any of the files in `controllers` or `services`, you'll see they don't import or require anything.

Instead they just expose a builder function (or factory function, or construction function, or whatever you want to name it), which in turn returns the actual object which is going to be used at runtime (remember that, in javascript, functions are first-class objects).

Let's take the `listUsersController` as an example:

```js
const listUsersController = getUsers => (req, res, next) => {
    const users = getUsers();
    res.send(JSON.stringify(users));
};

module.exports = listUsersController;
```

What this module exports is a function where a dependency has to be injected. However, when implementing the controller, we don't care where it is going to come from. We just expose the fact that the controller needs that `getUsers` dependency in order to properly work.

When that function is called with the dependency, it will return the actual controller (a simple express middleware).

The only place where actual modules are imported is the `config/services.js` file, which is a simple map where we basically define which are the dependencies for every object.

```js
const homeControllerFactory = require('../controllers/homeController');
const listUsersControllerFactory = require('../controllers/listUsersController');

const utils = require('../services/utils');
const getUsersFactory = require('../services/getUsers');

const services = {
    mainController: container => homeControllerFactory(),
    listUsersController: container => {
        const getUsers = container.get('getUsers');
        return listUsersControllerFactory(getUsers);
    },

    utilsService: container => utils,
    getUsers: container => {
        const utils = container.get('utilsService');
        return getUsersFactory(utils);
    }
};

module.exports = services;
```

This file only defines how the builder/creator/factory functions for every object have to be invoked, by first pulling their direct dependencies from the container, if any.

This file is then imported in the `server.js` file, which is our entry point. Together with the `container/container.js` file, they make a super basic dependency injection container.

Since this DIC is capable of recursively resolving dependencies, our `server.js` file is the only place where we manually pull objects from the container (the controllers in this case).

```js
const express = require('express');
const services = require('./config/services');
const container = require('./container/cotainer')(services);

const app = express();
const port = 3000;

// We pull the controllers from the container here
app.get('/', container.get('mainController'));
app.get('/users', container.get('listUsersController'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
```

### Evolving the proof of concept

We have defined a pretty simple approach where we have been able to fulfil all the requirements for a good dependency injection.

The code is easy to maintain, completely decoupled from the container and from other modules, and registering objects just takes two or three lines of code.

The main problem is that we are now forced to maintain a too basic DIC which also lacks some basic features, like lazy loading or avoiding the same service to be created more than once.

In order to solve that, we are going to introduce a project dependency on the [`BottleJS`](https://github.com/young-steveo/bottlejs) package, which is a dependency injection *micro* container.

Thanks to that package, we can evolve and merge our `config/services.js` and `container/container.js` files into a single one which looks like this:

```js
const Bottle = require('bottlejs');
 
const homeControllerFactory = require('../controllers/homeController');
const listUsersControllerFactory = require('../controllers/listUsersController');

const utils = require('../services/utils');
const getUsersFactory = require('../services/getUsers');

const bottle = new Bottle();

bottle.constant('utilsService', utils);
bottle.serviceFactory('getUsers', getUsersFactory, 'utilsService');

bottle.serviceFactory('mainController', homeControllerFactory);
bottle.serviceFactory('listUsersController', listUsersControllerFactory, 'getUsers');

module.exports = bottle.container;
```

It's basically the same, but this time, we just need to pass the list of dependencies for every object by its name to a `Bottle` instance, and then export the bottle container.

This container has also a few interesting extra features which might be handy in larger projects.

> The amount of stars in this package makes me think that maybe my previous conclusion was wrong, and dependency injection is more extended in javascript projects than I thought.

You can find the whole proof of concept project using `BottleJS` in the same repository, under the `with-bottle` branch, [here](https://github.com/acelaya-blog/dependency-injection-container-js/tree/with-bottle).

### Conclusion

My conclusion is that dependency injection in plain javascript and even non object-oriented projects is, not only possible, but desirable.

Having a really decoupled codebase, where true [dependency inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle) is achieved thanks to dependency injection, will make our projects much easier to maintain in the long term, and easier to unit test.

> I have not covered other scenarios in this article, like front-end application with [ReactJS](https://reactjs.org/) or [VueJS](https://vuejs.org/). I will try to do it in the future, when I have become wiser :P

> **Update 2018-12-16:** I have found an article where [Magnus Tovslid](https://medium.com/@magnusjt) proposes a very similar approach but for ReactJS and Redux front-end applications. Take a look at it, it's very interesting. [Inversion of Control and DI in Reactjs and Redux](https://medium.com/@magnusjt/inversion-of-control-and-di-in-reactjs-and-redux-35161fcef847)

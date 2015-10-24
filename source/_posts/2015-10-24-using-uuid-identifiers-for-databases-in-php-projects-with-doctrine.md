---
title: Using UUID identifiers for databases in PHP projects with Doctrine 
tags:
    - database
    - uuid
    - doctrine
    - security
categories:
    - php

---

It's well known that using autoincrement identifiers for resources in a public API is not a very good idea, since you are exposing too much information about the size of your database and your business in general.

The PHP community is recommending to better use UUIDs these days, because it hides that information and can be generated anywhere and still be unique.
 
It has a number of advantages. The first one, as I already said, is the fact that it hides iformation of the system when you have to publicly share it, it is not easy to find out anything about the business if you only have a UUID. But there are more:

* A UUID (**U**niversally **U**nique **ID**entifier) is universally unique. That menas that it is not unique only in the scope of a table, like an autoincrement, but unique accross any system in the world.
* Since it is globally unique, it can be generated before being stored in the database or even in client-side, and we can be sure (almost, I'm talking about this later) it won't be duplicated.
* Allows to easily migrate and merge information form different tables and databases, by keeping their identifier, since it will still be unique.

I'm going to explain now, how to take advantage of UUIDs when working with databases in PHP applications by using Doctrine and the fantastic [ramsey/uuid](https://github.com/ramsey/uuid) package, with the bridge library [ramsey/uuid-doctrine](https://github.com/ramsey/uuid-doctrine).

### Example project

For this article I have created a fully funcitonal example application, like in other articles, that you can find [here](https://github.com/acelaya-blog/php-doctrine-uuids). 

Just run these commands:

~~~bash
> git clone https://github.com/acelaya-blog/php-doctrine-uuids
> php composer.phar self-update
> php composer.phar install
> php -S 0.0.0.0:8000 -t public
~~~

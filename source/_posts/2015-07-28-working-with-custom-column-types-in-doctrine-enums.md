---
title: Working with custom column types in Doctrine. Enums
draft: true
categories:
    - php
tags:
    - doctrine
    - database
    - entity

---

Doctrine is currently the most used ORM in PHP. It makes it very easy to work with databases in an object oriented way.

It comes with a set of built-in column types that map database types with PHP types. For example, the **datetime** column type, persists the value of an entity column as a datetime in the database and handles it as a `DateTime` object when the entity is hydrated.

Type conversions work both ways, so column types take care of casting database to PHP types and vice versa.

In this article I'm going to explain how to define custom column types so that we can persist our own objects into the database and hydrate them back.

### PHP enums

One of the features that PHP lacks of, is a consistent enumerations API. You can always define a class full of constants, but PHP constants can only be scalars, so we can't define custom methods. Also, it is not possible to limit the values of an enumeration or typehint arguments and return types when using those constants.

For this purpose I recently discovered the [myclabs/php-enum](https://github.com/myclabs/php-enum) package. It provides a very good way to mimic Java enumerations in PHP.

Using this package, we can limit the values of properties in doctrine entities, but we need to tell doctrine how to persist those enumerations.

### Custom Doctrine type



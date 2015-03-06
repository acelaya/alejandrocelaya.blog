---
title: Dynamically create doctrine entity managers in Zend Framework 2
draft: true
categories:
    - php
    - zf2
tags:
    - zf2
    - zend-framework-2
    - doctrine
    - entity-manager
    - database

---

Some time ago I published an [article](http://blog.alejandrocelaya.com/2014/04/18/configure-multiple-database-connections-in-doctrine-with-zend-framework-2-2/) talking about different Doctrine configurations when using the `DoctrineORMModule` in Zend Framework 2 applications, so that you can create multiple database connections, either by using one entity manager or more than one.

Since then, many people have asked me how to configure the entity manager when the database connection configuration has to be generated dynamically, for example because you have more than one database and you need to choose one of them based on the group of a user.

I'm going to explain one possible approach to this problem.

### Introduction

Let's assume we have one default database with just one table that relates user groups with their corresponding database. 

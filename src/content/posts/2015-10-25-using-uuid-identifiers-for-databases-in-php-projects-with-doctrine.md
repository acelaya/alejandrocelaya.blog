---
layout: post
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
 
It has a number of advantages. The first one, as I already said, is the fact that it hides critical information of the system when you have to publicly share it, it is not easy to find out anything about the application business if you only have a UUID. But there are more:

* A UUID (**U**niversally **U**nique **ID**entifier) is universally unique. That menas that it is not unique only in the scope of a table, like an autoincrement, but unique accross any system in the world.
* Since it is globally unique, it can be generated before being stored in the database or even in client-side, and we can be sure (almost) it won't be duplicated.
* Allows to easily migrate and merge information from different tables and databases, by keeping their identifier, since it will still be unique.
* Decouples your application with the persistence layer, since all the information is generated before being persisted. (Thanks to **<a href="https://twitter.com/tomas2387/status/658237457117368320" target="_blank">@tomas2387</a>** for mentioning this)

I'm going to explain now, how to take advantage of UUIDs when working with databases in PHP applications by using Doctrine and the fantastic [ramsey/uuid](https://github.com/ramsey/uuid) package, with the bridge library [ramsey/uuid-doctrine](https://github.com/ramsey/uuid-doctrine).

### Creating entities

Entities will have an ID, but instead of setting them with an autoincrement strategy and an integer type, we are going to use the **uuid** doctrine type and typehint the ID as a `Ramsey\Uuid\UuidInterface`.

We are also going to initialize the ID in the entity's constructor. Once the entity is created, it will have an ID, generated outside the database, but unique, so we can safely persist the entity.
 
```php
namespace Acelaya\Blog\Entity;

use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

/**
 * @Entity
 * @Table(name="user")
 */
class User
{
    /**
     * @var UuidInterface
     *
     * @Id
     * @Column(type="uuid")
     */
    protected $id;
    /**
     * @var string
     *
     * @Column(length=256)
     */
    protected $username;
    /**
     * @var string
     *
     * @Column(length=256)
     */
    protected $password;
    /**
     * @var string
     *
     * @Column(length=256)
     */
    protected $fullName;

    public function __construct()
    {
        $this->id = Uuid::uuid4();
    }

    // Getters and setters...
}
```
As you can see, we don't have to set the `@GeneratedValue` annotation in the `id` property, since the value is not generated in the database. Instead, it is initialized in the contructor.

### Registering the type

The last example is very simple. We don't have to do anything, and our `id` will be a `Ramsey\Uuid\Uuid` instance, so we can compare it with other UUIDs and serialize it in many ways, but Doctrine doesn't know how to serialize and deserialize that field while exchanging data with the database. We need to register the **uuid** type.

```php
use Doctrine\DBAL\Types\Type;
use Ramsey\Uuid\Doctrine\UuidType;

// Some kind of bootstrapping...

Type::addType('uuid', UuidType::class);
```

Once this is set, we can use the **uuid** doctrine type for any property and it will be properly serialized/unserialized. We just need to initialize those properties in our entities's constructors with the desired UUID version.

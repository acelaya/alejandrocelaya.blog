---
layout: post
title: Working with custom column types in Doctrine. Enums.
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

Let's imagine we have this enum, and we want it to be a valid doctrine type.

~~~php
<?php
namespace Acelaya\Enum;

use MyCLabs\Enum\Enum;

class Action extends Enum
{
    const CREATE    = 'create';
    const READ      = 'read';
    const UPDATE    = 'update';
    const DELETE    = 'delete';
}
~~~

We also have this entity with a column of type `Acelaya\Enum\Action`.

~~~php
<?php
namespace Acelaya\Entity;

use Acelaya\Enum\Action;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity()
 * @ORM\Table(name="my_entities")
 */
class MyEntity
{
    /**
     * @var int
     *
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    /**
     * @var string
     *
     * @ORM\Column()
     */
    protected $name;
    /**
     * @var Action
     *
     * @ORM\Column(type="php_enum_action")
     */
    protected $action;

    // Getters and setters...
}
~~~

We have used the column type **php_enum_action** in the `Doctrine\ORM\Mapping\Column` annotation for the `$action` property. We now need to tell doctrine how to convert that type from PHP to database and how to hydrate the column back.

Defining a custom type in doctrine is as easy as creating a class extending `Doctrine\DBAL\Types\Type`, and overwriting the methods `getName`, `getSQLDeclaration`, `convertToPHPValue` and `convertToDatabaseValue`.

~~~php
<?php
namespace Acelaya\Type;

use Doctrine\DBAL\Platforms\AbstractPlatform;
use Doctrine\DBAL\Types\Type;
use Acelaya\Enum\Action;

class ActionEnumType extends Type
{        
    /**
     * Gets the name of this type.
     *
     * @return string
     */
    public function getName()
    {
        return 'php_enum_action';
    }
    
    /**
     * Gets the SQL declaration snippet for a field of this type.
     *
     * @param array $fieldDeclaration The field declaration.
     * @param \Doctrine\DBAL\Platforms\AbstractPlatform $platform The currently used database platform.
     *
     * @return string
     */
    public function getSQLDeclaration(array $fieldDeclaration, AbstractPlatform $platform)
    {
        return 'VARCHAR(256) COMMENT "php_enum_action"';
    }
    
    public function convertToPHPValue($value, AbstractPlatform $platform)
    {
        if (! Action::isValid($value)) {
            throw new \InvalidArgumentException(sprintf(
                'The value "%s" is not valid for the enum "%s". Expected one of ["%s"]',
                $value,
                Action::class,
                implode('", "', Action::keys())
            ));
        }
        return new Action($value);
    }
    
    public function convertToDatabaseValue($value, AbstractPlatform $platform)
    {
        return (string) $value;
    }
}
~~~

This is what each method does:

* **`getName`**: It just returns the name of the type that is used in the `Doctrine\ORM\Mapping\Column` annotation.
* **`getSQLDeclaration`**: Returns the SQL code used to create a field that is going to store the value of the enum in the database. A simple VARCHAR is enough in our case.
* **`convertToPHPValue`**: Gets the value of the database and casts it to a PHP value. In this case it is going to get a string (from the VARCHAR field) and return an `Acelaya\Enum\Action` instance with the correct value. It also checks that the value from the database is valid for the enum.
* **`convertToDatabaseValue`**: Finally this method casts the objects of type `Acelaya\Enum\Action` to something that can be stored in a VARCHAR column. Since objects of type `MyCLabs\Enum\Enum` implement the `__toString()` method, which returns the value of the corresponding constant, this operation is as simple as casting the value to string.

We now have to register this custom type so that doctrine is able to handle it.

At your application's bootstrap, make this call.

~~~php
// [...]

use Doctrine\DBAL\Types\Type;
use Acelaya\Type\ActionEnumType;

// [...]

Type::addType('php_enum_action', ActionEnumType::class);
~~~

And that's it! You can use your custom type wherever you want, and be sure that your entity properties will be objects properly persisted into the database.

### The Doctrine enum type package

I couldn't finish this article without mentioning a package that I published two days ago, the [acelaya/doctrine-enum-type](https://github.com/acelaya/doctrine-enum-type).

You have probably seen that the previous process needs to be done once per enum, since each custom type will need to return a different object type and have a different name.

This package eases that process, by providing a base abstract class, the `Acelaya\Doctrine\Type\AbstractPhpEnumType`, which implements the common parts. You will just need to define the name and the enum's object type, and then register each type.

For example, using this package, the `Acelaya\Type\ActionEnumType` would have been like this:

~~~php
<?php
namespace Acelaya\Type;

use Acelaya\Doctrine\Type\AbstractPhpEnumType;
use Acelaya\Enum\Action;

class ActionEnumType extends AbstractPhpEnumType
{
    /**
     * You have to define this so that type mapping is properly performed
     */
    protected $enumType = Action::class;

    /**
     * @return string
     */
    protected function getSpecificName()
    {
        return 'action';
    }
}
~~~

The rest of the process is the same.

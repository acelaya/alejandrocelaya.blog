---
layout: post
title: Configure multiple database connections in Doctrine with Zend Framework 2
permalink: /2014/04/18/configure-multiple-database-connections-in-doctrine-with-zend-framework-2-2
tags:
    - database
    - doctrine
    - mysql
    - zend-framework-2
    - zf2
categories:
    - php
    - zf

---

There are many situations where you need multiple database connections in your application.

In this post I am going to explain how to configure a connection to 2 databases to be used by Doctrine in Zend Framework 2 and how to configure a master-slave connection. Both examples will be using MySQL.

Lets asume we have a `doctrine_connection.global.php` configuration file, where we are going to define the doctrine database connection configuration. Any other doctrine configuration should be defined in other configuration files.

For further information on how Zend Framework 2 configuration works take a look at its [documentation](https://framework.zend.com/manual/2.2/en/tutorials/config.advanced.html).

### Two connections. Two entity managers.

Sometimes we could need to connect to two different databases and handle their connections separately, maybe because we need to work with our application database and a third party application database that can't be integrated in our system.

For this purpose, Doctrine allows us to define multiple connections and different EntityManagers to handle them. This could be our configuration file.

```php
<?php
return array(

    'doctrine' => array(

        // Connections
        'connection' => array(
            'orm_default' => array(
                'driverClass' =>'Doctrine\DBAL\Driver\PDOMySql\Driver',
                'params' => array(
                    'host'     => 'localhost',
                    'port'     => '3306',
                    'user'     => 'root',
                    'password' => 'foobar',
                    'dbname'   => 'main_database',
                    'driverOptions' => array(
                        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
                    ),
                )
            ),
            'orm_another' => array(
                'driverClass' =>'Doctrine\DBAL\Driver\PDOMySql\Driver',
                'params' => array(
                    'host'     => 'localhost',
                    'port'     => '3306',
                    'user'     => 'root',
                    'password' => 'foobar',
                    'dbname'   => 'another_database',
                    'driverOptions' => array(
                        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
                    ),
                )
            ),
        ),

        // Entity managers
        'entitymanager' => array(
            'orm_another' => array(
                'connection' => 'orm_another',
            )
        ),

    )
);
```

As you can see, two connections have been defined, the standard `orm_default` and a new `orm_another` connection.

To access the standard connection we can use the already existing `Doctrine\ORM\EntityManager` service or even the `doctrine.entitymanager.orm_default` service.

To access any other connection we should use, for example, the `doctrine.entitymanager.orm_another` service, where the last part of the service name is the connection name. This will return a new EntityManager instance that can be used to handle the other database

Then we only need to inject the desired EntityManager on each service that will need to make use of them.

### Master-slave connection. One entity manager.

The master-slave connection is very important in a high performance environment.

We can have a good cache system or server replication with load balancer, but finally if we only have one database, that will slow down the whole application. The master-slave system allows us to define "multiple" database connections that MySQL will internally synchronize.

It defines a unique database entry point, that is used for write operations (INSERT, UPDATE, DELETE) and multiple databases for reading operations (SELECT).

To set up this kind of connection in our `doctrine_connection.global.php` configuration file we could use something like this.

```php
<?php
return array(

    'doctrine' => array(
        'connection' => array(
            'orm_default' => array(
                'wrapperClass' => 'Doctrine\DBAL\Connections\MasterSlaveConnection',
                'params' => array(
                    'driver' => 'pdo_mysql',
                    'master' => array(
                        'host' => 'localhost',
                        'port' => '3306',
                        'user' => 'root',
                        'password' => 'foobar',
                        'dbname' => 'mydatabase',
                    ),
                    'slaves' => array(
                        array(
                            'host' => 'localhost',
                            'port' => '3306',
                            'user' => 'root',
                            'password' => 'foobar',
                            'dbname' => 'mydatabase2',
                        ),
                        array(
                            'host' => 'localhost',
                            'port' => '3306',
                            'user' => 'root',
                            'password' => 'foobar',
                            'dbname' => 'mydatabase3',
                        ),
                    ),
                ),
            )
        )
    ),

);
```

In this example we have defined a master connection and two slave connections. Doctrine will be aware of handling connections internally, it is transparent for us, we only need to use one EntityManager by getting the `Doctrine\ORM\EntityManager` service and we won't need to change anything in the code.

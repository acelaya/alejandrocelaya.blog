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

Let's assume we have one default database with a couple tables, one *users* which we will use to perform authentication, and another *groups* table that contains the name of the database for each one of those groups.

To access this database we are going to use the default `EntityManager`, with a configuration like this.

~~~php
return [
    
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                'driverClass' =>'Doctrine\DBAL\Driver\PDOMySql\Driver',
                'params' => [
                    'host'     => 'localhost',
                    'port'     => '3306',
                    'user'     => 'root',
                    'password' => 'foobar',
                    'dbname'   => 'main_database',
                    'driverOptions' => [
                        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                    ],
                ],
            ],
        ],
        
        'driver' => [
            'my_module_entities' => [
                'class' =>'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [
                    __DIR__ . '/../../module/MyModule/src/Entity',
                ]
            ],

            'orm_default' => [
                'drivers' => [
                    'MyModule\Entity' => 'my_module_entities',
                ]
            ],

        ],
        
        'authentication' => [
            // [...]
        ],
    ],

];
~~~

With this configuration it is easy to get an `EntityManager` instance, just by fetching it from the `ServiceManager` with the key `doctrine.entitymanager.orm_default`.

But how do we configure an entity manager connection when we don't know which is going to be the dbname?

### Dynamically update configuration

The first thig we are going to do es to define another connection configuration but leaving the dbname empty.

~~~php
return [
    
    'doctrine' => [
        'connection' => [
            'orm_default' => [
                // [...]
            ],
            'dynamic_orm' => [
                'driverClass' =>'Doctrine\DBAL\Driver\PDOMySql\Driver',
                'params' => [
                    'host'     => 'localhost',
                    'port'     => '3306',
                    'user'     => 'root',
                    'password' => 'foobar',
                    'dbname'   => '',
                    'driverOptions' => [
                        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                    ],
                ],
            ],
        ],
        
        'driver' => [
            'my_module_entities' => [
                'class' =>'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [
                    __DIR__ . '/../../module/MyModule/src/Entity',
                ]
            ],

            'orm_default' => [
                'drivers' => [
                    'MyModule\Entity' => 'my_module_entities',
                ]
            ],
            
            // I'm using the same entities for this connection, but you could change this
            'dynamic_orm' => [
                'drivers' => [
                    'MyModule\Entity' => 'my_module_entities',
                ]
            ],

        ],
        
        'authentication' => [
            // [...]
        ],
        
        'entitymanager' => [
            'dynamic_orm' => [
                'connection' => 'dynamic_orm',
           ],
        ],

    ],

];
~~~

Now I'm going to define a custom factory that will get current user's database name and update the configuration on the fly before creating the `EntityManager`.

~~~php
namespace Acelaya\Blog\Service\Factory;

use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class DynamicEMFactory implements FactoryInterface
{
    public funciton createService(ServiceLocatorInterface $serviceLocator)
    {
        // Get current user
        $authService = $serviceLocator->get('Zend\Authentication\AuthenticationService');
        if (! $authService->hasIdentity()) {
            throw new \RuntimeException(
                'It is not possible to create a dynamic entity manager before a user has logged in'
            );
        }
        
        $user = $authService->getIdentity();
        $dbName = $user->getGroup()->getDbName();
        
        // Update connection config
        $globalConfig = $serviceLocator->get('config');
        $globalConfig['doctrine']['connection']['dynamic_orm']['params']['dbname'] = $dbName;
        
        $isAllowOverride = $serviceLocator->getAllowOverride();
        $serviceLocator->setAllowOverride(true)
        $serviceLocator->setService('config', $globalConfig);
        $serviceLocator->setAllowOverride($isAllowOverride);
        
        // Now that the service manager configuration is up to date, we can safely fetch the service
        return $serviceLocator->get('doctrine.entitimanager.dynamic_orm');
    }
}
~~~

Let's see what this factory does.

The first thing we do is to make sure that a user has logged in the system. In case it is not, we throw an exception. Usually, our ACL system will prevent any endpoint that depends on this dynamic `EntityManager` to be hit before that happens, but any unexpected error will be easier to debug this way.

Then we get the global configuration service, update the database name for the dynamic_orm and overwrite the updated configuration service.

We have to make sure that we are able to override services in the `ServiceManager` before doing it, because its default behavior is to throw an exception if we try to do that. Then we reset the 'allow override' state to its previous state, to prevent unexpected bugs.

Finally we use the DoctrineModule's standard factories to create our `EntityManager` and return it.

The last thing to do would be to define a custom name for this service.

~~~php
return [
    'service_manager' => [
        'factories' => [
            'DynamicEntityManager' => 'Acelaya\Blog\Service\Factory\DynamicEMFactory'
        ]
    ]
];
~~~

And that should be it. 
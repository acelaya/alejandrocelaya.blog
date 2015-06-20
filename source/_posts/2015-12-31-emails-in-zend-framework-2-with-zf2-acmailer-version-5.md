---
title: Emails in Zend Framework 2 with ZF2-AcMailer version 5
draft: true
tags:
    - github
    - modules
    - zf2
    - zend-framework-2
    - zf2-acmailer
    - emails
categories:
    - php
    - zf2

---

About a month ago I released the Zend Framework 2 module [ZF2-AcMailer](https://github.com/acelaya/ZF2-AcMailer) version 5.0.0. This new major version includes some important improvements, and a new configuration system that allows multiple mail services to be registered.

When this module was on its first version, I wrote [an article](http://blog.alejandrocelaya.com/2014/03/02/send-emails-in-a-zend-framework-2-application-using-zf2-acmailer-module/) explaining how to use it, but a lot has changed since then, so I thought it was a good idea to write a new one with updated information.

With this article I'm going to explain all the new features of the module.

### Installation

One of the main changes is that [composer](https://getcomposer.org/) is now the only supported installation method. The ZF2 autoloading files have been removed, and it no longer depends on the Zend\Load component, so it is not possible to use it (or at least, it is very hard) without using composer.

It is also important to know that the minimum PHP version is now PHP 5.4. I've dropped support for PHP 5.3 because it is no longer maintained by Zend, and it's safer to stick with latest versions.

This said, in a composer-based project, installing this module is as easy as running the command `composer require acelaya/zf2-acmailer`, and the last version will be installed.

Also, this module uses [Semantic Versioning](http://semver.org/), so it is safe to use the default version notation, which should be ~5.0.

Finally, enable the module in your application configuration file.

~~~php
return [
    'modules' => [
        'Application',
        'AcMailer' // <- Add this line
    ],
]
~~~

### The new configuration structure

This module used to allow to configure only one service that was meant to be used to send emails. The problem was that some users were asking to configure other different services, because they needed to use different transports for different purposes and such.

That was hard to achieve with earlier versions, because you had to update the configuration at runtime.

This version now allows to configure multiple services, in a similar way as the [DoctrineORMModule](https://github.com/doctrine/DoctrineORMModule) creates multiple `EntityManagers`, by using composed configuration blocks consumed by abstract factories instead of concrete factories.

This made me change the configuration structure, in order to wrap each spceific configuration under the service name, so that the factory was able to know which block to consume.

Since I was going to change that, I took the opportunity to make other naming changes and refactor everything, wrapping related configuration keys under common blocks, and dropping custom `AbstractOptions` objects in order to use standard ZF2 options objects.

The result was an structure like this.

~~~php
return [
    'acmailer_options' => [

        // Default mail service
        'default' => [
            'extends' => null,

            'mail_adapter' => '\Zend\Mail\Transport\Sendmail',

            'smtp_options' => [
                'host' => 'localhost',
                'port' => 25,
                'connection_class' => 'smtp',
                'connection_config' => [
                    'username' => '',
                    'password' => '',
                    'ssl' => false,
                ],
            ],

            'file_options' => [
                'path' => 'data/mail/output',
                'callback' => null,
            ],

            'message_options' => [
                'from' => '',
                'from_name' => '',
                'to' => [],
                'cc' => [],
                'bcc' => [],
                'subject' => '',
                'body' => [
                    'content' => '',
                    'charset' => 'utf-8',
                    'use_template' => false,
                    'template' => [
                        'path'          => 'ac-mailer/mail-templates/layout',
                        'params'        => [],
                        'children'      => [
                            'content'   => [
                                'path'   => 'ac-mailer/mail-templates/mail',
                                'params' => [],
                            ]
                        ],
                        'default_layout' => [
                            'path' => null,
                            'params' => [],
                            'template_capture_to' => 'content'
                        ]
                    ],
                ],

                'attachments' => [
                    'files' => [],
                    'dir' => [
                        'iterate'   => false,
                        'path'      => 'data/mail/attachments',
                        'recursive' => false,
                    ],
                ],
            ],

            'mail_listeners' => []
        ],

        // Another mail service
        'christmas' => [
            'extends' => 'default'
        ]
    ]
];
~~~

The first change that can be seen is that the top level configuration key is no longer `mail_options`, but `acmailer_options`. I thought it was safer to use the module name, in order to prevent naming collisions. However, the old configuration key will keep working, but it's deprecated and will be removed in the next major version.

Then, the next level defines each individual mail service. In this case there are two services defined, the **'default'** service and the **'christmas'** service.

Each one of the services can contain any of the concrete configuration entries.

There are 5 main configuration blocks.

* **mail_adapter**: The transport object to be used by the mail service. It can be either a `Zend\Mail\Transport\TransportInterface` instance, a fully qualified class name as string, or a service name as string. You can also use aliases for the standard ZF2 transports.
    * *sendmail*: To use a `Zend\Mail\Transport\Sendmail`.
    * *smtp*: To use a `Zend\Mail\Transport\Smtp`. 
    * *file*: To use a `Zend\Mail\Transport\File`.
    * *null* or *in_memory*: To use a `Zend\Mail\Transport\InMemory` (or a `Zend\Mail\Transport\Null` in ZF2.3 and earlier).
* **smtp_options**: This block is only used when using a `Zend\Mail\Transport\Smtp` transport, and defines the SMTP connection configuration, as in the [`Zend\Mail\Transport\SmtpOptions`](https://github.com/zendframework/zend-mail/blob/master/src/Transport/SmtpOptions.php) class.
* **file_options**: This block is only used when using a `Zend\Mail\Transport\File` transport, and defines the configuration, as in the [`Zend\Mail\Transport\FileOptions`](https://github.com/zendframework/zend-mail/blob/master/src/Transport/FileOptions.php) class.
* **message_options**: This block defines how the message is going to be created, from simple headers like the recipients, the sender and the subject, to the way to create the body. The body can be defined as a raw content using the **'content'** configuration, but it can be rendered from a template too using the **'template'** configuration, which is disabled by default, but will overwrite the **'content'** if enabled using the **'use_template'** configuration.
    * *template*: The template config wraps the information to create the body from templates that will be rendered at runtime. It can define a simple template with no children, or a layout with nested children that will be recursively rendered inside of it. Also, a **'default_layout'** can be difined that will be used as the parent template for all the emails sent with this service.
    * *attachments*: Defines a list of files or a directory containing files that will be attached to the email at runtime.
* **mail_listeners**: It is a list of mail listeners that will we attached to the mail service at creation time. They can be either `AcMailer\Event\MailListenerInterface` instances, fully qualified class names as string, or service names as string that return `AcMailer\Event\MailListenerInterface` instances.

There is another new configuration block, the **extends**. It defines another configuration block from wich this one should extend its configuration. This way, there is no need to repeat the same configuration over and over if it is going to be the same in more than one mail service.

For example, in the example, the christmas service will have the same configuration as the default service.

Any configuration that is redefined will overwrite the extended configuration.

#### Migrate from old configurations

### Fetch mail services

### Others

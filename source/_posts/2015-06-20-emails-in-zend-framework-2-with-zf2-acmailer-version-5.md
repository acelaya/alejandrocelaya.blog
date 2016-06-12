---
title: Emails in Zend Framework 2 with ZF2-AcMailer version 5
tags:
    - github
    - modules
    - zf2
    - zend-framework-2
    - zf2-acmailer
    - emails
categories:
    - php
    - zf

---

About a month ago I released the Zend Framework 2 module [ZF2-AcMailer](https://github.com/acelaya/ZF2-AcMailer) version 5.0.0. This new major version includes some important improvements, and a new configuration system that allows multiple mail services to be registered.

When this module was on its first version, I wrote [an article](http://blog.alejandrocelaya.com/2014/03/02/send-emails-in-a-zend-framework-2-application-using-zf2-acmailer-module/) explaining how to use it, but a lot has changed since then, so I thought it was a good idea to write a new one with updated information.

With this article I'm going to explain all the new features of the module.

### Installation

One of the main changes is that [composer](https://getcomposer.org/) is now the only supported installation method. The ZF2 autoloading files have been removed, and it no longer depends on the Zend\Load component, so it is not possible to use it (or at least, it is very hard) without using composer.

It is also important to know that the minimum PHP version is now PHP 5.4. I've dropped support for PHP 5.3 because it is no longer maintained, and it's safer to stick with the latest versions.

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

This made me change the configuration structure, in order to wrap each specific configuration under the service name, so that the factory was able to know which block to consume.

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
* **mail_listeners**: It is a list of mail listeners that will be attached to the mail service at creation time. They can be either `AcMailer\Event\MailListenerInterface` instances, fully qualified class names as string, or service names as string that return `AcMailer\Event\MailListenerInterface` instances.

There is another new configuration block, the **extends**. It defines another configuration block from wich this one should extend its configuration. This way, there is no need to repeat the same configuration over and over if it is going to be the same in more than one mail service.

For example, in the example, the christmas service will have the same configuration as the default service.

Any configuration that is redefined will overwrite the extended configuration.

#### Migrate from old configurations

In order to ease the migration from older versions, it is possible to automatically generate the new configuration from the old one by using a CLI entry point.

You just have to have the old **'mail_options'** configuration in the global config, so that it can be read from there, and then, this tool will output the result with the new structure, in phpArray, json, ini or xml format. It can be directly dumped into a file if you prefer so.

Just run this command:

~~~bash
php public/index.php acmailer parse-config
~~~

This will output the new configuration in phpArray format. To define another format, use the `format` value flag. like this.

~~~bash
php public/index.php acmailer parse-config --format=ini
~~~

To directly dump the configuration into a config file, use the `outputFile` value flag.

~~~bash
php public/index.php acmailer parse-config --outputFile="config/autoload/new_mail.global.php"
~~~

Take into account that you will loose any business logic in your config files, since this consumes the generated configuration. For example, if you are reading a password from an environment variable, you will have to manually check the output of this command to fix that, because the password will be now hardcoded in your new config file.

Also, since this version supports multiple mail services, the old configuration will be wrapped into the **'default'** mail service.

### Fetch mail services

As I've mentioned earlier in this article, it is possible to define multiple mail services now. With previous versions, there was just one mail service under the `AcMailer\Service\MailService` key.

Now, there is a simple namespaced syntax to fetch any mail service from the `ServiceManager`. Use the `acmailer.mailservice.` prefix followed by the concrete mail service name.

For example, `acmailer.mailservice.default` or `acmailer.mailservice.christmas`.

If you try to use a name that wasn't defined in the configuration, the `ServiceManager` will throw an exception.

Additionally, the `AcMailer\Service\MailService` will keep working as an alias of the `acmailer.mailservice.default` service, to make migration easier.

### Using mail services

Once you have fetched a mail service, any configuration automatically set at creation time can be overwritten by any dynamically generated value. Also, there is a public `send()` method that will send the final message by using the configured transport.

#### Send the email

In order to send the email, just fetch the service and call to the `send()` method. It will return a `AcMailer\Result\MailResult` instance.

~~~php
$mailService = $sm->get('acmailer.mailservice.default');
$mailService->setBody('This is the body');

$result = $mailService->send();
if ($result->isValid()) {
    echo 'Message sent. Congratulations!';
} else {
    if ($result->hasException()) {
        echo sprintf(
            'An error occurred. Exception: \n %s',
            $result->getException()->getTraceAsString()
        );
    } else {
        echo sprintf('An error occurred. Message: %s', $result->getMessage());
    }
}
~~~

#### Customize the message

It is very probable that the recipients of the message (for example) have to be dynamically set from the information of a form.

Use the `getMessage()` method to get the wrapped `Zend\Mail\Message` instance and customize it.

~~~php
$mailService = $sm->get('acmailer.mailservice.default');

$message = $mailService->getMessage();
$message->setSubject('This is the subject')
        ->addTo('foobar@example.com')
        ->addTo('another@example.com')
        ->addBcc('hidden@domain.com');
~~~

#### Customize the body

The recommended way to set the body is by using the `setBody()` or `setTemplate()` methods of the mail service, depending if you want to set a raw body or a template to be rendered.

In any case, the charset can be provided.

Raw bodies:

~~~php
$mailService->setBody('Hello!!');
$mailService->setBody('Hello!!', 'utf-8');
$mailService->setBody('<h1>Hello!!</h1>', 'utf-8');

$part = new \Zend\Mime\Part();
$part->charset = 'utf-8';
$mailService->setBody($part);

$mailService->setBody($part, 'utf-8');
~~~

Templates:

~~~php
$mailService->setTemplate(new Zend\View\Model\ViewModel(), ['charset' => 'utf-8']);
$mailService->setTemplate('application/emails/my-template', [
    'charset' => 'utf-8',
    'date' => date('Y-m-d'),
    'foo' => 'bar',
]);
~~~

Complex templates:

~~~php
$layout = new \Zend\View\Model\ViewModel([
    'name' => 'John Doe',
    'date' => date('Y-m-d')
]);
$layout->setTemplate('application/emails/merry-christmas');

$footer = new \Zend\View\Model\ViewModel();
$footer->setTemplate('application/emails/footer');

$layout->addChild($footer, 'footer');

$mailService->setTemplate($layout);
~~~

There is also a `setSubject()` public method, but it is marked as deprecated in this version and will be removed in the future. Use the `$message->setSubject()` method instead.

#### Set attachments

It is possible to add attachments or clean the attachments list before sending the message, by using the setter and adder methods.

~~~php
$mailService->addAttachment('data/mail/attachments/file1.pdf');
$mailService->addAttachment('data/mail/attachments/file2.pdf', 'different-filename.pdf');

// Add two more attachments to the list
$mailService->addAttachments([
    'another-name.pdf' => 'data/mail/attachments/file3.pdf',
    'data/mail/attachments/file4.zip'
]);
// At this point there are 4 attachments ready to be sent with the email

// If we call this, all previous attachments will be discarded
$mailService->setAttachments([
    'data/mail/attachments/another-file1.pdf',
    'name-to-be-displayed.png' => 'data/mail/attachments/another-file2.png'
]);

// A good way to remove all attachments is to call this
$mailService->setAttachments([]);
~~~

### Events layer

This module comes with its own events layer.

The mail services wrap a list of event managers that listen to three different events in the send process. When you call the method `send()`, just after trying to use the transport to send the message, the event `MailEvent::EVENT_MAIL_PRE_SEND` is triggered.

If everything works fine and the message is dispatched, the event `MailEvent::EVENT_MAIL_POST_SEND` is triggered. In this case, the result will be valid.

Finally, if an error occurs and an exception is thrown, the event `MailEvent::EVENT_MAIL_SEND_ERROR` is triggered. In this case the result won't be valid, and it will wrap the produced exception.

The mail listeners are attached and detached with two simple methods.

~~~php
$mailListener = new \Application\Event\MyMailListener();
$mailService->attachMailListener($mailListener);

if ($foo) {
    // If foo, I want to detach the listener
    $mailService->detachMailListener($mailListener);
}

$mailService->send();
~~~

This module doesn't come with any built-in mail listener, you will have to create your own listeners by extending `AcMailer\Event\AbstractMailListener` and implementing the `onPreSend`, `onPostSend` and `onSendError` methods, which receive a `AcMailer\Event\MailEvent` object as an argument, which in turn wraps the mail service itself, so that you can customize anything at any of those points.

### Others

Other minor changes are that the license has been changed from BSD to MIT, and that the build is running under PHP7, as well as 5.4, 5.5, 5.6 and hhvm. It is currently passing, so the module should theoretically work in all of those environments.

This is not the best module in the world, but it will help you send emails from Zend Framework 2 based applications.

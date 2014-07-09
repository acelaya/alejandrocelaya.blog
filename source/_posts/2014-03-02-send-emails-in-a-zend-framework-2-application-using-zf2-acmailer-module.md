---
title: Send emails in a Zend Framework 2 application using ZF2-AcMailer module
tags:
    - composer
    - github
    - modules
    - zf2
    - zend-framework-2
    - zf2-acmailer
categories:
    - php

---

Some time ago I created a Zend Framework 2 module designed to wrap Zend\Mail and ease sending emails in a Zend Framework 2 application. I was copy-pasting the code of that module in many applications so I decided it was a good candidate to become an independent module.

After creating it I pushed it to [github](https://github.com/) and registered it in [packagist](https://packagist.org/), allowing it to be installed by using [composer](https://getcomposer.org/). Then I registered it in the official [Zend Framework 2 modules](http://modules.zendframework.com/) webpage. In this post I am going to explain how to use it and all the features it includes. The module can be found [here](https://github.com/acelaya/ZF2-AcMailer).

It has grown in the last months, adding more features. File attachemnts, composition of emails from templates, event handling, SMTP over SSL, etc.

At the moment of writing this article the last published version is 1.8.2

### Installing the module.

AcMailer can be easily installed by using composer. Just add it to your composer.json file, in the require element.

~~~json
{
    "require": {
        "acelaya/zf2-acmailer": "1.*"
    }
}
~~~

Then run `php composer.phar install` to get it downloaded in your vendor directory. Finally enable the module by adding it to your application.config.php file.

~~~php
'modules' => array(

    'AcMailer',
    'Application',

    ...

),
~~~

### The MailService

The main object in this module is the `AcMailer\Service\MailService`. It provides all the functionality to send emails by using Zend\Mail.

It depends on a `Zend\Mail\Message` object, a `Zend\Mail\Transport\TransportInterface` and a `Zend\View\Renderer\RendererInterface`.

The last one is used to render views when composing the email from a template.

After creating the service instance, it can be used to set the body and the subject of the message. Any other data can be set by using the message object. For example.

~~~php
<?php
// ...

$transport = new \Zend\Mail\Transport\Sendmail();
$message   = new \Zend\Mail\Message();
$renderer  = new \Zend\View\Renderer\PhpRenderer();

$message->setFrom("alejandro@domain.com", "Alejandro Celaya")
        ->setTo(array("address1@domain.com", "address2@domain.com"));

$service = new \AcMailer\Service\MailService($message, $transport, $renderer);
$service->setBody("<p>This is the body</p>")
        ->setSubject("This is the subject");

try {
    $result = $service->send();
    echo $result->isValid() ? "Success!!" : "Error";
} catch (\Exception $e) {
    echo "Exception!! " . $e->getMessage();
}
~~~

This example shows how to manually create a MailService and use it to send an email, however the ZF2-AcMailer module includes a registered service that reads the configuration and creates a MailService instance ready to be used. It is registered as AcMailer\Service\MailService.

The `AcMailer\Service\Factory\MailServiceFactory` is responsible for creating that preconfigured MailService. [Take a look at it](https://github.com/acelaya/ZF2-AcMailer/blob/master/src/AcMailer/Service/Factory/MailServiceFactory.php).

While setting the body, the MailService takes care to cast it to a proper object, accepting either a plain string, a HTML string, a `Zend\Mime\Message` or a `Zend\Mime\Part`.

If a template is set by calling the `setTemplate` method, then the previous body will be discarded and the result of rendering that template will be used.

Files can be attached to the email before sending it, by calling `addAttachment`, `addAttachemnts` or `setAttachments` methods, which will receive a file path or an array of file paths.

### MailService configuration.

The registered service reads the configuration looking for a ‘mail_options’ entry. An empty mail_options configuration array is included with the module at config/mail.global.php.dist. Feel free to customize it as you need. Every configuration option is explained at that file, but this are those options.

* **mail_adapter:** Tells mail service what type of transport adapter should be used. SMTP and Sendmail are supported and values for this option can be any of these:
    * `Zend\Mail\Transport\Sendmail`
    * `Sendmail`
    * `sendmail`
    * `Zend\Mail\Transport\Smtp`
    * `Smtp`
    * `smtp`
* **server:** IP address or server name to be used while using an SMTP server. Will be ignored while using Sendmail.
* **port:** SMTP server port while using SMTP server. Will be ignored while using Sendmail.
* **from:** From email address.
* **from_name:** From name to be displayed.
* **to:** It can be a string with one destination email address or an array of multiple addresses.
* **cc:** It can be a string with one carbon copy email address or an array of multiple addresses.
* **bcc:** It can be a string with one blind carbon copy email address or an array of multiple addresses.
* **smtp_user:** Username to be used for authentication against SMTP server. If none is provided the fromoption will be used for this purpose.
* **smtp_password:** Password to be used for authentication against SMTP server.
* **ssl:** Defines type of connection encryption against SMTP server. Values are `false` to disable SSL, and 'ssl' or 'tls'.
* **body:** Default body to be used. Usually this will be generated at runtime, but can be set as a string at config file. It can contain HTML too.
* **subject:** Default email subject.
* **template:** Array with template configuration. It has 3 child options.
    * _use_template:_ True or false. Tells if template should be used, making body option to be ignored.
    * _path:_ Path of the template. The same used while setting the template of a ViewModel ('application/index/list').
    * _params:_ Array with key-value pairs with parameters to be sent to the template.
* **attachments_dir:** Path to a directory that will be recursively iterated. All found files will be attached to the email automatically. Will be ignored if it is not a string or is not an existing directory. This means that you could set it to `false` to disable this option.

This configuration is mapped to an Options object at runtime, which is consumed by the MailServiceFactory. The Options object is registered in the ServiceManager with the key AcMailer\Options\MailOptions.

### Event handling

The module takes care to trigger three types of events. One event is triggered just before sending the email, one is triggered just after sending the email if everything was OK and anothert is triggered if an error occured while sending the email.

To handle those email events you just need to implement the `AcMailer\Event\MailListener` interface, which provides three methods that are called when those three events are triggered. For example.

~~~php
<?php
namespace Application\Mail\Event;

use AcMailer\Event\MailListener;
use AcMailer\Event\MailEvent;

class MyMailListener implements MailListener
{
    public function osPreSend(MailEvent $e)
    {
        echo "The email is going to be sent";
    }

    public function osPostSend(MailEvent $e)
    {
        echo "The email was properly sent";
    }

    public function osSendError(MailEvent $e)
    {
        echo "An error occured while sending the email";
    }
}
~~~

Then attach a MailListener to the MailService.

~~~php
<?php

// ...

$mailService = $serviceManager->get("AcMailer\Service\MailService");
$mailService->attachMailListener(new \Application\Mail\Event\MyMailListener(), 5);
~~~

When the method `send` is called, all the events are triggered in order of priority (the second argument) or in the order they were attached if they have the same priority.

The MailEvent object provided to any of the methods defined in the MailListener can be used to get the instance of the MailService who triggered that event, by calling the getMailService method.

~~~php
<?php
namespace Application\Mail\Event;

use AcMailer\Event\MailListener;
use AcMailer\Event\MailEvent;

class MyMailListener implements MailListener
{
    public function osPreSend(MailEvent $e)
    {
        // Get the service;
        $mailService = $e->getMailService();
    }

    // ...
}
~~~

This can be useful to change destination addresses before sending the email if some condition happened, for example.

### Unit testing

The MailService object should be injected in other services that will need to use it. To allow those services be properly tested the MailService implements an interface that can be used to define Mocks. Indeed a MailServiceMock is provided. Feel free to use it.

All the module’s unit tests are located at the test folder and should pass while running them in the scope of a Zend Framework 2 application.